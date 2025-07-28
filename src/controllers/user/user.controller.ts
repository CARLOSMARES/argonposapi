import { Controller, Get, Inject } from '@nestjs/common';
import { UserService } from 'src/service/user/user.service';

@Controller('user')
export class UserController {

    constructor(

        @Inject()
        private readonly userService: UserService

    ){
    }

    @Get()
    async getAll(){
        return this.userService.findAll();
    }    

}
