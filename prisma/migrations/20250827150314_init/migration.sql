-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    `role` ENUM('admin', 'staff') NOT NULL,
    `password` VARCHAR(300) NOT NULL,
    `email` VARCHAR(60) NOT NULL,
    `phone` VARCHAR(13) NOT NULL,
    `profile` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tenant` (
    `tenant_id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    `email` VARCHAR(60) NOT NULL,
    `phone` VARCHAR(13) NOT NULL,
    `dob` DATETIME(3) NOT NULL,
    `profile` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Tenant_email_key`(`email`),
    PRIMARY KEY (`tenant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoomType` (
    `roomtype_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`roomtype_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `room_id` INTEGER NOT NULL AUTO_INCREMENT,
    `room_number` VARCHAR(10) NOT NULL,
    `floor` INTEGER NOT NULL,
    `roomtype_id` INTEGER NOT NULL,
    `status` ENUM('available', 'occupied', 'reserved') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`room_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RentalContract` (
    `rentalcontract_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `room_id` INTEGER NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `rent_amount` DECIMAL(10, 2) NOT NULL,
    `deposit` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('active', 'expired', 'terminated') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`rentalcontract_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `booking_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `room_id` INTEGER NOT NULL,
    `booking_date` DATETIME(3) NOT NULL,
    `status` ENUM('pending', 'confirmed', 'cancelled') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stay` (
    `stay_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `room_id` INTEGER NOT NULL,
    `check_in` DATETIME(3) NOT NULL,
    `check_out` DATETIME(3) NOT NULL,
    `status` ENUM('ongoing', 'completed') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`stay_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `stay_id` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `payment_date` DATETIME(3) NOT NULL,
    `method` ENUM('cash', 'credit_card') NOT NULL,
    `status` ENUM('pending', 'paid', 'failed') NOT NULL,

    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `notification_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL, 
    `message` TEXT NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_roomtype_id_fkey` FOREIGN KEY (`roomtype_id`) REFERENCES `RoomType`(`roomtype_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentalContract` ADD CONSTRAINT `RentalContract_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`tenant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentalContract` ADD CONSTRAINT `RentalContract_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Room`(`room_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`tenant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Room`(`room_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stay` ADD CONSTRAINT `Stay_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`tenant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stay` ADD CONSTRAINT `Stay_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Room`(`room_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`tenant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_stay_id_fkey` FOREIGN KEY (`stay_id`) REFERENCES `Stay`(`stay_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`tenant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
