import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CommonModule } from "@/modules/common/common.module";
import { MockModule } from "@/modules/mock/mock.module";

@Module({
  imports: [CommonModule, MockModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
