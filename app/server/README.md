# HTTP server installation


```bash
sudo add-apt-repository ppa:ondrej/apache2
sudo apt-get update
sudo apt-get install apache2

cd /etc/apache2/mods-enabled
sudo ln -sf ../mods-available/socache_shmcb.* .
sudo ln -sf ../mods-available/ssl.* .
sudo ln -sf ../mods-available/http2.* .

sudo a2enmod rewrite headers
sudo a2dismod deflate -f

mkdir -p /opt/certs/boxaudio.app
# put cert into that folder
chmod 400 /opt/certs/boxaudio.app/boxaudio.app.key
```

**/etc/apache2/sites-enabled/000-default.conf**

```apacheconfig
<VirtualHost *:80>
    ServerAdmin admin@boxaudio.app
    DocumentRoot "/var/www/html"
    ServerName boxaudio.app

    RewriteEngine On
    RewriteCond %{HTTPS} !=on
    RewriteRule ^/?(.*) https://%{SERVER_NAME}/$1 [R,L]
</VirtualHost>

<VirtualHost *:443>
    ServerAdmin admin@boxaudio.app
    SSLEngine on
    DocumentRoot "/var/www/html"

    SSLCertificateFile "/opt/certs/boxaudio.app/boxaudio.app.crt"
    SSLCertificateKeyFile "/opt/certs/boxaudio.app/boxaudio.app.key"
    SSLCACertificateFile "/opt/certs/boxaudio.app/bundle-ca.crt"
    FallbackResource /

    <Directory /var/www/html>
        Options +MultiViews -FollowSymLinks
        AddEncoding gzip .gz
    
        <FilesMatch ".*\.gz$">
            RemoveEncoding .gz
            AddType application/gzip .gz
            Header set Content-Encoding gzip
        </FilesMatch>
    
        <FilesMatch ".*\.js.gz$">
            ForceType application/javascript
        </FilesMatch>
    
        <FilesMatch ".*\.css.gz$">
            ForceType text/css
        </FilesMatch>
    
        <FilesMatch ".*\.html.gz$">
            ForceType text/html
        </FilesMatch>
    
        <FilesMatch ".*\.json.gz$">
            ForceType application/json
        </FilesMatch>
    
        <FilesMatch ".*\.woff2.gz$">
            ForceType font/woff2
        </FilesMatch>
    </Directory>
</VirtualHost>
```

```bash
systemctl restart apache2
```
