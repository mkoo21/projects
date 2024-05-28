
# copy selected docker volume contents into repo
# Paperless ngx document directory

rsync -avc Paperless_media/_data/documents/originals /home/martin/apps/paperless-ngx/paperless-ngx/backup

# Wrap up
git add *
git commit -m "Backup $(date)"
git branch -D server-backup # don't forget -e flag!
git checkout -b server-backup
git push origin server-backup
git checkout @{-1}
