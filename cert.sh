#!/usr/bin/env bash

WEBSITE_OPTIONS='-d zikailiu.com'

sudo systemctl stop nginx

~/.acme.sh/acme.sh --server letsencrypt --issue ${WEBSITE_OPTIONS} --standalone -k ec-256 || echo "Skipped TLS certification refresh"

sudo chmod a+w /usr/share/nginx
~/.acme.sh/acme.sh --installcert ${WEBSITE_OPTIONS} --fullchainpath "/usr/share/nginx/zikailiu.com.crt" --keypath "/usr/share/nginx/zikailiu.com.key" --ecc
sudo chmod a-w /usr/share/nginx

sudo systemctl start nginx
