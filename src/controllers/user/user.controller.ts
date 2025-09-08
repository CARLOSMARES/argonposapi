import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
import { UserService } from 'src/service/user/user.service';

@ApiTags('user')
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

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number){
        return this.userService.findOne(id);
    }

    @Post()
    async create(@Body() payload: CreateUserDto){
        return this.userService.create(payload);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateUserDto
    ){
        return this.userService.update(id, payload);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number){
        await this.userService.remove(id);
        return { success: true };
    }

}
