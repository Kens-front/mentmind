import { AppGateway } from "src/app.gateway";
import { Global, Module } from "@nestjs/common";
import { JwtPort } from "src/jwt/jwt.service";
import { JwtService } from "@nestjs/jwt";

@Global()
@Module({
  imports: [],
  providers: [AppGateway, JwtPort, JwtService],
  exports: [AppGateway,]
})
export class GatewyModul {

}
  