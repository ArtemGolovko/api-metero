import { Migration } from '@mikro-orm/migrations';

export class Migration20220602112941 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `hashtag` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `hashtag` add unique `hashtag_name_unique`(`name`);');

    this.addSql('create table `user` (`username` varchar(255) not null, `name` varchar(255) not null, `avatar` varchar(255) not null, `profile_banner` varchar(255) not null, `description` text not null, `is_private` tinyint(1) not null default false, `verified` tinyint(1) not null default false, primary key (`username`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `post` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime null, `text` text not null, `images` text not null, `author_username` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post` add index `post_author_username_index`(`author_username`);');

    this.addSql('create table `post_hashtags` (`post_id` int unsigned not null, `hashtag_id` int unsigned not null, primary key (`post_id`, `hashtag_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post_hashtags` add index `post_hashtags_post_id_index`(`post_id`);');
    this.addSql('alter table `post_hashtags` add index `post_hashtags_hashtag_id_index`(`hashtag_id`);');

    this.addSql('create table `comment` (`id` int unsigned not null auto_increment primary key, `text` text not null, `author_username` varchar(255) not null, `post_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `comment` add index `comment_author_username_index`(`author_username`);');
    this.addSql('alter table `comment` add index `comment_post_id_index`(`post_id`);');

    this.addSql('create table `reply` (`id` int unsigned not null auto_increment primary key, `text` text not null, `author_username` varchar(255) not null, `comment_id` int unsigned not null, `to_username` varchar(255) null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `reply` add index `reply_author_username_index`(`author_username`);');
    this.addSql('alter table `reply` add index `reply_comment_id_index`(`comment_id`);');
    this.addSql('alter table `reply` add index `reply_to_username_index`(`to_username`);');

    this.addSql('create table `user_subscribers` (`user_1_username` varchar(255) not null, `user_2_username` varchar(255) not null, primary key (`user_1_username`, `user_2_username`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user_subscribers` add index `user_subscribers_user_1_username_index`(`user_1_username`);');
    this.addSql('alter table `user_subscribers` add index `user_subscribers_user_2_username_index`(`user_2_username`);');

    this.addSql('create table `post_likes` (`post_id` int unsigned not null, `user_username` varchar(255) not null, primary key (`post_id`, `user_username`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post_likes` add index `post_likes_post_id_index`(`post_id`);');
    this.addSql('alter table `post_likes` add index `post_likes_user_username_index`(`user_username`);');

    this.addSql('create table `post_marked_users` (`post_id` int unsigned not null, `user_username` varchar(255) not null, primary key (`post_id`, `user_username`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post_marked_users` add index `post_marked_users_post_id_index`(`post_id`);');
    this.addSql('alter table `post_marked_users` add index `post_marked_users_user_username_index`(`user_username`);');

    this.addSql('create table `comment_likes` (`comment_id` int unsigned not null, `user_username` varchar(255) not null, primary key (`comment_id`, `user_username`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `comment_likes` add index `comment_likes_comment_id_index`(`comment_id`);');
    this.addSql('alter table `comment_likes` add index `comment_likes_user_username_index`(`user_username`);');

    this.addSql('create table `reply_likes` (`reply_id` int unsigned not null, `user_username` varchar(255) not null, primary key (`reply_id`, `user_username`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `reply_likes` add index `reply_likes_reply_id_index`(`reply_id`);');
    this.addSql('alter table `reply_likes` add index `reply_likes_user_username_index`(`user_username`);');

    this.addSql('alter table `post` add constraint `post_author_username_foreign` foreign key (`author_username`) references `user` (`username`) on update cascade;');

    this.addSql('alter table `post_hashtags` add constraint `post_hashtags_post_id_foreign` foreign key (`post_id`) references `post` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `post_hashtags` add constraint `post_hashtags_hashtag_id_foreign` foreign key (`hashtag_id`) references `hashtag` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `comment` add constraint `comment_author_username_foreign` foreign key (`author_username`) references `user` (`username`) on update cascade;');
    this.addSql('alter table `comment` add constraint `comment_post_id_foreign` foreign key (`post_id`) references `post` (`id`) on update cascade;');

    this.addSql('alter table `reply` add constraint `reply_author_username_foreign` foreign key (`author_username`) references `user` (`username`) on update cascade;');
    this.addSql('alter table `reply` add constraint `reply_comment_id_foreign` foreign key (`comment_id`) references `comment` (`id`) on update cascade;');
    this.addSql('alter table `reply` add constraint `reply_to_username_foreign` foreign key (`to_username`) references `user` (`username`) on update cascade on delete set null;');

    this.addSql('alter table `user_subscribers` add constraint `user_subscribers_user_1_username_foreign` foreign key (`user_1_username`) references `user` (`username`) on update cascade on delete cascade;');
    this.addSql('alter table `user_subscribers` add constraint `user_subscribers_user_2_username_foreign` foreign key (`user_2_username`) references `user` (`username`) on update cascade on delete cascade;');

    this.addSql('alter table `post_likes` add constraint `post_likes_post_id_foreign` foreign key (`post_id`) references `post` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `post_likes` add constraint `post_likes_user_username_foreign` foreign key (`user_username`) references `user` (`username`) on update cascade on delete cascade;');

    this.addSql('alter table `post_marked_users` add constraint `post_marked_users_post_id_foreign` foreign key (`post_id`) references `post` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `post_marked_users` add constraint `post_marked_users_user_username_foreign` foreign key (`user_username`) references `user` (`username`) on update cascade on delete cascade;');

    this.addSql('alter table `comment_likes` add constraint `comment_likes_comment_id_foreign` foreign key (`comment_id`) references `comment` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `comment_likes` add constraint `comment_likes_user_username_foreign` foreign key (`user_username`) references `user` (`username`) on update cascade on delete cascade;');

    this.addSql('alter table `reply_likes` add constraint `reply_likes_reply_id_foreign` foreign key (`reply_id`) references `reply` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `reply_likes` add constraint `reply_likes_user_username_foreign` foreign key (`user_username`) references `user` (`username`) on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `post_hashtags` drop foreign key `post_hashtags_hashtag_id_foreign`;');

    this.addSql('alter table `post` drop foreign key `post_author_username_foreign`;');

    this.addSql('alter table `comment` drop foreign key `comment_author_username_foreign`;');

    this.addSql('alter table `reply` drop foreign key `reply_author_username_foreign`;');

    this.addSql('alter table `reply` drop foreign key `reply_to_username_foreign`;');

    this.addSql('alter table `user_subscribers` drop foreign key `user_subscribers_user_1_username_foreign`;');

    this.addSql('alter table `user_subscribers` drop foreign key `user_subscribers_user_2_username_foreign`;');

    this.addSql('alter table `post_likes` drop foreign key `post_likes_user_username_foreign`;');

    this.addSql('alter table `post_marked_users` drop foreign key `post_marked_users_user_username_foreign`;');

    this.addSql('alter table `comment_likes` drop foreign key `comment_likes_user_username_foreign`;');

    this.addSql('alter table `reply_likes` drop foreign key `reply_likes_user_username_foreign`;');

    this.addSql('alter table `post_hashtags` drop foreign key `post_hashtags_post_id_foreign`;');

    this.addSql('alter table `comment` drop foreign key `comment_post_id_foreign`;');

    this.addSql('alter table `post_likes` drop foreign key `post_likes_post_id_foreign`;');

    this.addSql('alter table `post_marked_users` drop foreign key `post_marked_users_post_id_foreign`;');

    this.addSql('alter table `reply` drop foreign key `reply_comment_id_foreign`;');

    this.addSql('alter table `comment_likes` drop foreign key `comment_likes_comment_id_foreign`;');

    this.addSql('alter table `reply_likes` drop foreign key `reply_likes_reply_id_foreign`;');

    this.addSql('drop table if exists `hashtag`;');

    this.addSql('drop table if exists `user`;');

    this.addSql('drop table if exists `post`;');

    this.addSql('drop table if exists `post_hashtags`;');

    this.addSql('drop table if exists `comment`;');

    this.addSql('drop table if exists `reply`;');

    this.addSql('drop table if exists `user_subscribers`;');

    this.addSql('drop table if exists `post_likes`;');

    this.addSql('drop table if exists `post_marked_users`;');

    this.addSql('drop table if exists `comment_likes`;');

    this.addSql('drop table if exists `reply_likes`;');
  }

}
