import { Migration } from '@mikro-orm/migrations';

export class Migration20210709153431 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null default \'NOW()\', "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null);');

    this.addSql('alter table "member" drop constraint if exists "member_created_at_check";');
    this.addSql('alter table "member" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "member" alter column "created_at" set default \'NOW()\';');
  }

}
