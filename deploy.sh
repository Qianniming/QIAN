#!/bin/bash

# WELL-LI Cases Deployment Script
# This script handles the deployment of the application to production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="well-li-cases"
BACKUP_DIR="./backups"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking deployment requirements..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        log_warn ".env file not found. Please create one from .env.example"
        log_info "Copying .env.example to .env..."
        cp .env.example .env
        log_warn "Please edit .env file with your production values before continuing."
        exit 1
    fi
    
    log_info "Requirements check passed."
}

backup_database() {
    log_info "Creating database backup..."
    
    # Create backup directory if it doesn't exist
    mkdir -p "$BACKUP_DIR"
    
    # Create backup filename with timestamp
    BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    
    # Create database backup if MongoDB is running
    if docker-compose -f "$DOCKER_COMPOSE_FILE" ps mongodb | grep -q "Up"; then
        docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T mongodb mongodump \
            --authenticationDatabase admin \
            --username "${MONGO_ROOT_USERNAME:-admin}" \
            --password "${MONGO_ROOT_PASSWORD:-password}" \
            --archive | gzip > "$BACKUP_FILE"
        
        log_info "Database backup created: $BACKUP_FILE"
    else
        log_warn "MongoDB not running, skipping database backup."
    fi
}

build_application() {
    log_info "Building application..."
    
    # Build Docker images
    docker-compose -f "$DOCKER_COMPOSE_FILE" build --no-cache
    
    log_info "Application build completed."
}

deploy_application() {
    log_info "Deploying application..."
    
    # Stop existing containers
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
    
    # Start new containers
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
    
    # Wait for application to start
    log_info "Waiting for application to start..."
    sleep 30
    
    # Check if application is healthy
    if check_health; then
        log_info "Application deployed successfully."
    else
        log_error "Application deployment failed. Check logs with: docker-compose -f $DOCKER_COMPOSE_FILE logs"
        exit 1
    fi
}

check_health() {
    log_info "Checking application health..."
    
    # Wait for app to be ready
    for i in {1..10}; do
        if curl -f http://localhost:3000/api/health &> /dev/null; then
            log_info "Application is healthy."
            return 0
        fi
        log_info "Waiting for application... ($i/10)"
        sleep 10
    done
    
    log_error "Application health check failed."
    return 1
}

cleanup_old_images() {
    log_info "Cleaning up old Docker images..."
    
    # Remove dangling images
    docker image prune -f
    
    # Remove old application images (keep last 3)
    docker images "$APP_NAME" --format "table {{.Repository}}:{{.Tag}}\t{{.CreatedAt}}\t{{.ID}}" | \
        tail -n +2 | sort -k2 -r | tail -n +4 | awk '{print $3}' | xargs -r docker rmi
    
    log_info "Cleanup completed."
}

initialize_database() {
    log_info "Initializing database..."
    
    # Wait for database to be ready
    for i in {1..10}; do
        if docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T mongodb mongosh --eval "db.runCommand('ping')" &> /dev/null; then
            break
        fi
        log_info "Waiting for database... ($i/10)"
        sleep 10
    done
    
    # Run database initialization
    docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T app npm run db:init
    
    log_info "Database initialization completed."
}

show_status() {
    log_info "Application Status:"
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
    
    log_info "Application Logs (last 20 lines):"
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=20 app
}

# Main deployment process
main() {
    log_info "Starting deployment of $APP_NAME..."
    
    case "${1:-deploy}" in
        "check")
            check_requirements
            ;;
        "backup")
            backup_database
            ;;
        "build")
            check_requirements
            build_application
            ;;
        "deploy")
            check_requirements
            backup_database
            build_application
            deploy_application
            initialize_database
            cleanup_old_images
            show_status
            log_info "Deployment completed successfully!"
            log_info "Application is available at: http://localhost:3000"
            ;;
        "health")
            check_health
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup_old_images
            ;;
        *)
            echo "Usage: $0 {check|backup|build|deploy|health|status|cleanup}"
            echo ""
            echo "Commands:"
            echo "  check   - Check deployment requirements"
            echo "  backup  - Create database backup"
            echo "  build   - Build application images"
            echo "  deploy  - Full deployment (default)"
            echo "  health  - Check application health"
            echo "  status  - Show application status"
            echo "  cleanup - Clean up old Docker images"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"