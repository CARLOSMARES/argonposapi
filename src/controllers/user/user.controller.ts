import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
import { UserService } from 'src/service/user/user.service';
import { Public } from 'src/auth/public.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('user')
@Controller('user')
export class UserController {

    constructor(

        @Inject()
        private readonly userService: UserService

    ){
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAll(){
        return this.userService.findAll();
    }    

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id', ParseIntPipe) id: number){
        return this.userService.findOne(id);
    }

    @Public()
    @Post()
    async create(@Body() payload: CreateUserDto){
        return this.userService.create(payload);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateUserDto
    ){
        return this.userService.update(id, payload);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id', ParseIntPipe) id: number){
        await this.userService.remove(id);
        return { success: true };
    }

}
