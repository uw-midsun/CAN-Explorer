# DEBUGGING

Notes from team members on common issues that might creep up in development of this project


## Djongo giving SQL Decode Errors when applying migrations

Currently the workaround is to downgrade the sqlparse library to 0.2.4 as per [this ticket](https://github.com/nesdis/djongo/issues/505). We can upgrade to the newest version of Djongo when the fix gets released.

