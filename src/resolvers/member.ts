import { Member } from "../entities/Member";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "src/technical/types";

@Resolver()
export class MemberResolver {

    // # Get all Members
    @Query(() => [Member])
    members(
        @Ctx() ctx: MyContext
    ): Promise<Member[]> {
        return ctx.orm.find(Member, {});
    } 

    // Get one Member
    @Query(() => Member, { nullable: true })
    member(
        @Arg('id', () => Int) id: number,
        @Ctx() ctx: MyContext
    ): Promise<Member | null> {
        return ctx.orm.findOne(Member, { id });
    } 
    
    // Create one Member
    @Mutation(() => Member)
    async createMember(
        @Arg('name', () => String) name: string,
        @Ctx() ctx: MyContext
    ): Promise<Member> {
        const memberToCreate = ctx.orm.create(Member, {name})
        await ctx.orm.persistAndFlush(memberToCreate)
        return memberToCreate
    } 

    // Delete one Member
    @Mutation(() => Boolean)
    async deleteMember(
        @Arg('id', () => Int) id: number,
        @Ctx() ctx: MyContext
    ): Promise<Boolean> {
        const member = await ctx.orm.findOne(Member, { id })
        if (!member) {
            return false
        }
        else {
            ctx.orm.removeAndFlush(member)
            return true
        }
    }

}