#!/usr/bin/env bash

WEBSITE_OPTIONS='-d zikailiu.com -d liuzik.ai'

systemctl stop nginx

~/.acme.sh/acme.sh --issue ${WEBSITE_OPTIONS} --standalone -k ec-256 || echo "Skipped TLS certification refresh"
~/.acme.sh/acme.sh --installcert ${WEBSITE_OPTIONS} --fullchainpath "/usr/share/nginx/portfolio.crt" --keypath "/usr/share/nginx/portfolio.key" --ecc

systemctl start nginx
