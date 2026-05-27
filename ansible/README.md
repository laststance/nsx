# NSX Production Provisioning

This playbook provisions `nsx.malloc.tokyo` from bare Ubuntu to a running NSX production host: OS baseline, deploy user, SSH hardening, firewall, Docker/MySQL, Node/pnpm, PM2, Let's Encrypt, app build, backup cron, and log retention.

## Inventory

`inventory.ini` points at the production host:

```ini
nsx.malloc.tokyo ansible_host=206.189.154.194 ansible_user=deploy
```

For the first bootstrap on a root-only server, run with `-u root`. After the deploy user exists, use the default `deploy` user.

## Vault

Create encrypted production secrets before running the playbook:

```bash
cp group_vars/webservers/vault.yml.example group_vars/webservers/vault.yml
ansible-vault encrypt group_vars/webservers/vault.yml
ansible-vault edit group_vars/webservers/vault.yml
```

Required vault values include JWT secrets, MySQL passwords, deploy SSH public keys, certbot email, backup GPG recipient, and offsite rsync target. The role renders `/home/deploy/nsx/.env` from these vault variables with mode `0600`.

## Run

```bash
cd ansible

# First bootstrap if the host only allows root SSH.
ansible-playbook playbook.yml -u root --ask-vault-pass

# Normal idempotent maintenance run after deploy SSH works.
ansible-playbook playbook.yml --ask-vault-pass --ask-become-pass
```

The playbook intentionally uses task-level `become: true` only for privileged system changes. Application checkout, dependency install, build, and PM2 process management run as `deploy`.

## Coverage

- Base system: apt cache/packages, timezone, locale, swap, unattended upgrades
- Security: deploy user, limited sudoers group, key-only SSH, root SSH disabled, UFW, fail2ban
- Docker: Docker Engine package, Compose v2, production MySQL compose stack
- Runtime: NodeSource signed APT repo, corepack pnpm, PM2, pm2-logrotate
- TLS: certbot via snap, initial certificate, explicit renewal cron
- Application: git clone, vault-backed `.env`, pnpm install, Prisma migrate, frontend/server build, PM2 start
- Monitoring: journald `SystemMaxUse=500M`, snap retain limit
- Backup: encrypted backup cron installed by `scripts/install-backup-cron`
