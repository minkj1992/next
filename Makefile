# DEST_DIRS := ./client/ ./server
DEST_DIRS := ./sandbox
PM2 := ./node_modules/.bin/pm2

.PHONY: watch-dev
watch-dev: pnpm_install.stamp_generated \
		stop-watch-dev \
		self_signed_certificate_generated/.dirstamp \
	./port_check_kill.mts
	@$(PM2) cleardump
	@$(PM2) flush
	bash -c "trap 'make stop-watch-dev' EXIT; \
			$(PM2) logs & \
			$(PM2) start; \
			wait"

.PHONY: stop-watch-dev
stop-watch-dev: pnpm_install.stamp_generated
	$(PM2) stop all || :
	$(PM2) kill

pnpm_install.stamp_generated: $(shell ./ls_files.bash '*package.json' '*pnpm-lock.yaml')
	@pnpm install --frozen-lockfile --recursive
	@$(call touch_target_file)

# Reference: https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-20-04-1
# ignore log:  > /dev/null 2>&1
self_signed_certificate_generated/.dirstamp:
	@mkdir -p ./self_signed_certificate_generated
	@cd ./self_signed_certificate_generated/ && openssl req -x509 -nodes -days 36500 -newkey rsa:2048 -subj '/CN=localhost' -keyout key.pem -out cert.pem > /dev/null 2>&1
	@$(MAKE) copy-certs
	@$(call touch_target_file)


copy-certs:
	@for dir in $(DEST_DIRS); do \
		cp -r ./self_signed_certificate_generated $$dir; \
	done
