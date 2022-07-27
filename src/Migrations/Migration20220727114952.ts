import { Migration } from '@mikro-orm/migrations';

export class Migration20220727114952 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` modify `avatar` varchar(255) null, modify `profile_banner` varchar(255) null;');
    this.addSql('alter table `user` drop `deleted_at`;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` add `deleted_at` date null default null;');
    this.addSql('alter table `user` modify `avatar` varchar(255) not null, modify `profile_banner` varchar(255) not null;');
  }

}
