FROM quay.io/keycloak/keycloak:23.0.0

# Switch to root to copy files
USER root

# Copy realm config (for import)
COPY realm-config /opt/keycloak/data/import

# Copy custom themes
COPY themes /opt/keycloak/themes

# Set proper ownership
RUN chown -R keycloak:keycloak /opt/keycloak/data/import /opt/keycloak/themes

# Switch back to Keycloak user
USER keycloak

# Start in dev mode and import the realm
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--import-realm"]
