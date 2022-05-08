import { Migration } from '@mikro-orm/migrations';

export class Migration20220508145709 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` add `description` text not null, add `verified` tinyint(1) not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` drop `description`;');
    this.addSql('alter table `user` drop `verified`;');
  }

}
