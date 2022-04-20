import { Migration } from '@mikro-orm/migrations';

export class Migration20220419134747 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `user` (`username` varchar(255) not null, `first_name` varchar(255) not null, `last_name` varchar(255) not null, primary key (`username`)) default character set utf8mb4 engine = InnoDB;');
  }

}
