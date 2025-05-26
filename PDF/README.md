```bash
<VirtualHost *:80>
    ServerName localhost

    DocumentRoot ""

    <Directory "">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

</VirtualHost>
```