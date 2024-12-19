import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnimatorDashboardService {
	constructor(
		@InjectRepository(Users) 
	private readonly userRepository: Repository<Users>,) {}

	async getAnimator(id: number): Promise<object> {
		let user = await this.userRepository.createQueryBuilder("users")
		.where("users.user_id = :id",{id})
		.getOne();
		return {name: user.user_name};
	}
}