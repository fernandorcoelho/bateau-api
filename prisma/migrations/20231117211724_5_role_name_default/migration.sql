-- AlterTable
ALTER TABLE `roles` MODIFY `name` ENUM('Admin', 'Moderator', 'Participant', 'Crowd') NOT NULL DEFAULT 'Crowd';
