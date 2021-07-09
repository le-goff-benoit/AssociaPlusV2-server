import { Migration } from '@mikro-orm/migrations';

export class Migration20210709134755 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "member" rename column "_id" to "id";');


    this.addSql('alter table "member" drop constraint if exists "member_created_at_check";');
    this.addSql('alter table "member" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "member" alter column "created_at" set default \'NOW()\';');
  }

}
