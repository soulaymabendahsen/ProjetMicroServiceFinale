FROM quay.io/keycloak/keycloak:23.0.0

# Switch to root to copy files
USER root

# Copy realm config (for import)
COPY realm-config /opt/keycloak/data/import

# Copy custom themes
COPY themes /opt/keycloak/themes

# ✅ Copy custom provider JAR into Keycloak providers directory
COPY providers/keycloak-2fa-email-authenticator-1.0.0.0-SNAPSHOT.jar /opt/keycloak/providers/

# Set proper ownership
RUN chown -R keycloak:keycloak /opt/keycloak/data/import /opt/keycloak/themes /opt/keycloak/providers

# Switch back to keycloak user
USER keycloak

# ✅ Build custom providers
RUN /opt/keycloak/bin/kc.sh build

# ✅ Start Keycloak
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--import-realm"]
