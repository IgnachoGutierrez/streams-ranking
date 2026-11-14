#!/bin/sh
# Makes the retired-site redirect optional: when LEGACY_DOMAIN is empty or
# unset, drop the rendered legacy.conf so nginx neither serves the redirect
# nor looks for the old domain's TLS certificate (useful for QA).
#
# The nginx image runs /docker-entrypoint.d/*.sh in order before starting
# nginx; 20-envsubst-on-templates.sh has already rendered the templates into
# conf.d by the time this runs.
set -eu

if [ -z "${LEGACY_DOMAIN:-}" ]; then
    rm -f /etc/nginx/conf.d/legacy.conf
    echo "$0: LEGACY_DOMAIN is empty, legacy redirect disabled"
fi
