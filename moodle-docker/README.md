Set loose permitions:
Inside ./moodle-docker
```
chmod 777 moodle
```
```
docker compose up -d --build
```
Wait 20-30 secons to give the database time to run for the first time.

Run the instalation script with the following params

```
sudo docker compose exec -u www-data web php admin/cli/install.php
```
```



                                 .-..-.
   _____                         | || |
  /____/-.---_  .---.  .---.  .-.| || | .---.
  | |  _   _  |/  _  \/  _  \/  _  || |/  __ \
  * | | | | | || |_| || |_| || |_| || || |___/
    |_| |_| |_|\_____/\_____/\_____||_|\_____)

Moodle 5.3dev (Build: 20260519) command line installation program
-------------------------------------------------------------------------------
== Choose a language ==
en - English (en)
? - Available language packs
type value, press Enter to use default value (en)
:
-------------------------------------------------------------------------------
== Data directories permission ==
type value, press Enter to use default value (2777)
:
-------------------------------------------------------------------------------
== Web address ==
type value
: http://localhost:8080
-------------------------------------------------------------------------------
== Data directory ==
type value, press Enter to use default value (/var/www/moodledata)
:
-------------------------------------------------------------------------------
== Notice ==
The version of Moodle that you are about to install or upgrade to contains
unstable "Alpha" development code that is not suitable for use on most production
sites. If this is not what you wanted then you should make sure you are updating
from a STABLE branch of the Moodle code. See Moodle Docs for more details.
More help: http://docs.moodle.org/503/en/admin/versions
Continue
type y (means yes) or n (means no)
: y
-------------------------------------------------------------------------------
== Choose database driver ==
 mysqli
 auroramysql
 mariadb
type value, press Enter to use default value (mysqli)
: mysqli
-------------------------------------------------------------------------------
== Database host ==
type value, press Enter to use default value (localhost)
: db
-------------------------------------------------------------------------------
== Database name ==
type value, press Enter to use default value (moodle)
:
-------------------------------------------------------------------------------
== Tables prefix ==
type value, press Enter to use default value (mdl_)
:
-------------------------------------------------------------------------------
== Database port ==
type value, press Enter to use default value ()
: 3306
-------------------------------------------------------------------------------
== Database user ==
type value, press Enter to use default value (root)
:
-------------------------------------------------------------------------------
== Database password ==
type value
: rootpassword
-------------------------------------------------------------------------------
== Full site name ==
type value
: Moodle docker
-------------------------------------------------------------------------------
== Short name for site (eg single word) ==
type value
: moodleDocker
-------------------------------------------------------------------------------
== Admin account username ==
type value, press Enter to use default value (admin)
: admin
-------------------------------------------------------------------------------
== New admin user password ==
type value
: admin_password
-------------------------------------------------------------------------------
== New admin user email address ==
type value, press Enter to use default value ()
: laureanogarciadimaritno@gmail.com
-------------------------------------------------------------------------------
== Support email address ==
type value, press Enter to use default value ()
:
-------------------------------------------------------------------------------
== Noreply address ==
type value, press Enter to use default value ()
:
-------------------------------------------------------------------------------
== Upgrade key (leave empty to not set it) ==
type value
:
-------------------------------------------------------------------------------
== Copyright notice ==
Moodle  - Modular Object-Oriented Dynamic Learning Environment
Copyright (C) 1999 onwards Martin Dougiamas (https://moodle.com)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the Moodle License information page for full details: https://moodledev.io/general/license

Have you read these conditions and understood them?
type y (means yes) or n (means no)
: y
```

Change permisions and run again
```
chmod 755 moodle
chmod 644 moodle/config.php
docker compose restart web
```

If everything is succesfull this should have the login page:

http://localhost:8080/login/index.php?loginredirect=1

user: admin
password: admin_password