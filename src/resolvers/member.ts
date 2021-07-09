import { Query, Resolver } from "type-graphql";

@Resolver()
export class MemberResolver {
    @Query(() => String)
    getMembers() {
        return 'Hello World' 
    }
}