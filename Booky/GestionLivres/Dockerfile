FROM openjdk:17

# Create directories for database and uploads
RUN mkdir -p /Database/Data
RUN mkdir -p /uploads

# Create a script to copy files if they exist
RUN echo '#!/bin/bash' > /copy-data.sh && \
    echo 'if [ -f "Database/Data/Livres.mv.db" ]; then' >> /copy-data.sh && \
    echo '  echo "Copying existing database..."' >> /copy-data.sh && \
    echo '  cp Database/Data/Livres.mv.db /Database/Data/' >> /copy-data.sh && \
    echo 'else' >> /copy-data.sh && \
    echo '  echo "No existing database found"' >> /copy-data.sh && \
    echo 'fi' >> /copy-data.sh && \
    echo 'if [ -d "uploads" ]; then' >> /copy-data.sh && \
    echo '  echo "Copying uploads directory..."' >> /copy-data.sh && \
    echo '  cp -r uploads/* /uploads/ 2>/dev/null || echo "No files in uploads"' >> /copy-data.sh && \
    echo 'else' >> /copy-data.sh && \
    echo '  echo "No uploads directory found"' >> /copy-data.sh && \
    echo 'fi' >> /copy-data.sh && \
    chmod +x /copy-data.sh

# Copy all project files temporarily to check what exists
COPY . /tmp/project/

# Run the copy script
RUN cd /tmp/project && /copy-data.sh

# Clean up temporary files
RUN rm -rf /tmp/project /copy-data.sh

# Expose the application port
EXPOSE 8095

# Copy and rename the actual JAR file
ADD target/GestionLivres-0.0.1-SNAPSHOT.jar GestionLivres.jar

# Set working directory
WORKDIR /

# Run the application
ENTRYPOINT ["java", "-jar", "GestionLivres.jar"]
