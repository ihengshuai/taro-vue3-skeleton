import { Module } from "@nestjs/common";
import { MockController } from "./mock.controller";

@Module({
  controllers: [MockController],
})
export class MockModule {}
