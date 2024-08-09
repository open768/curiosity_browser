.echo on
/*open the database*/
.open objstore.db
/*add user column*/
ALTER TABLE AUTH ADD COLUMN US TEXT;
ALTER TABLE CKAUTH ADD COLUMN US TEXT;
ALTER TABLE objstore ADD COLUMN US TEXT;
ALTER TABLE FB ADD COLUMN US TEXT;
ALTER TABLE PDS ADD COLUMN US TEXT;
ALTER TABLE HTMLCAC ADD COLUMN US TEXT;

/*create tables*/
CREATE TABLE 'ROVERMAN' ( 
    'RE' TEXT not null,
    'HA' TEXT not null, 
    'CO' TEXT,
    'US' TEXT,
    'DA' DATETIME DEFAULT CURRENT_TIMESTAMP,
     primary key ( 'RE', 'HA')
);

CREATE TABLE 'Locations' ( 
    'RE' TEXT not null,
    'HA' TEXT not null, 
    'CO' TEXT,
    'US' TEXT,
    'DA' DATETIME DEFAULT CURRENT_TIMESTAMP,
     primary key ( 'RE', 'HA')
);

CREATE TABLE 'ROVER' ( 
    'RE' TEXT not null,
    'HA' TEXT not null, 
    'CO' TEXT,
    'US' TEXT,
    'DA' DATETIME DEFAULT CURRENT_TIMESTAMP,
     primary key ( 'RE', 'HA')
);

CREATE TABLE 'PDS' ( 
    'RE' TEXT not null,
    'HA' TEXT not null, 
    'CO' TEXT,
    'US' TEXT,
    'DA' DATETIME DEFAULT CURRENT_TIMESTAMP,
     primary key ( 'RE', 'HA')
);
CREATE TABLE 'INDEX' ( 
    'RE' TEXT not null,
    'HA' TEXT not null, 
    'CO' TEXT,
    'US' TEXT,
    'DA' DATETIME DEFAULT CURRENT_TIMESTAMP,
     primary key ( 'RE', 'HA')
);


/*move content out of objstore that doesnt belong there*/
/*dont care about cached http anyway*/
delete from objstore where RE='CACHTTP';

insert into PDS select * from objstore where RE='PDS';
delete from objstore where RE='PDS';

insert into FB select * from objstore where RE='FB';
delete from objstore where RE='FB';

insert into 'INDEX' select * from objstore where RE='INDEX';
delete from objstore where RE='INDEX';
