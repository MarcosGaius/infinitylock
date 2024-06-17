import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718218962797 implements MigrationInterface {
    name = 'Migration1718218962797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "health_score_config" ("id" SERIAL NOT NULL, "maxScore" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "schemaId" integer, CONSTRAINT "REL_a0223c49f9a0c51cf4a8fec64d" UNIQUE ("schemaId"), CONSTRAINT "PK_5336d8f7a06e6a3060d0ba6e55f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "form_schema" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d523e804f6b9a7b9bf92484c37e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "type" character varying NOT NULL, "order" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "formSchemaId" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "alternative" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "score" integer NOT NULL, "order" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "questionId" integer, CONSTRAINT "PK_93e717011957def707e61de0723" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answer" ("id" SERIAL NOT NULL, "discursive" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "questionId" integer, "answeredFormId" integer, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answered_form" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "companyId" integer, "formId" integer, CONSTRAINT "PK_0c7b64b6e24467826398d63b48b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "form" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "active" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyId" integer, "schemaId" integer, CONSTRAINT "PK_8f72b95aa2f8ba82cf95dc7579e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sector" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyId" integer, CONSTRAINT "PK_668b2ea8a2f534425407732f3ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "headcount" integer NOT NULL, "cnpj" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "health_score" ("id" SERIAL NOT NULL, "score" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_697da9dd403aaa96897e5e57205" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "document" character varying NOT NULL, "documentType" character varying NOT NULL DEFAULT 'cpf', "birthdate" date NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "phone" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyId" integer, "sectorId" integer, "healthScoreId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "REL_b61949228eafdb00189ddc56b3" UNIQUE ("healthScoreId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answer_alternative_alternative" ("answerId" integer NOT NULL, "alternativeId" integer NOT NULL, CONSTRAINT "PK_d6c78d2d19160def402abc07bd4" PRIMARY KEY ("answerId", "alternativeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dedc535599d399cb86136c9222" ON "answer_alternative_alternative" ("answerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a34d5dcd15140f965e39fb1c40" ON "answer_alternative_alternative" ("alternativeId") `);
        await queryRunner.query(`ALTER TABLE "health_score_config" ADD CONSTRAINT "FK_a0223c49f9a0c51cf4a8fec64d3" FOREIGN KEY ("schemaId") REFERENCES "form_schema"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_b34e93060feaa072950e872df2c" FOREIGN KEY ("formSchemaId") REFERENCES "form_schema"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "alternative" ADD CONSTRAINT "FK_987e598dc6447a20fa182141434" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_3e1fc24ea9ec602c86f62f48b8a" FOREIGN KEY ("answeredFormId") REFERENCES "answered_form"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answered_form" ADD CONSTRAINT "FK_552add7a604ab0bacd6818bc940" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answered_form" ADD CONSTRAINT "FK_3667f825e4d1a85982c6554f8cb" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answered_form" ADD CONSTRAINT "FK_4fc7b76775aad23acfe18b45f89" FOREIGN KEY ("formId") REFERENCES "form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form" ADD CONSTRAINT "FK_e7c21930b8fd234e8b9242a045a" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form" ADD CONSTRAINT "FK_0ef0d37b964b6e83f07523e7904" FOREIGN KEY ("schemaId") REFERENCES "form_schema"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sector" ADD CONSTRAINT "FK_2c911887cf103bd20e84d42b182" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_86586021a26d1180b0968f98502" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3639d9ed266735b8fe0635bede2" FOREIGN KEY ("sectorId") REFERENCES "sector"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_b61949228eafdb00189ddc56b3a" FOREIGN KEY ("healthScoreId") REFERENCES "health_score"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer_alternative_alternative" ADD CONSTRAINT "FK_dedc535599d399cb86136c92228" FOREIGN KEY ("answerId") REFERENCES "answer"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "answer_alternative_alternative" ADD CONSTRAINT "FK_a34d5dcd15140f965e39fb1c409" FOREIGN KEY ("alternativeId") REFERENCES "alternative"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer_alternative_alternative" DROP CONSTRAINT "FK_a34d5dcd15140f965e39fb1c409"`);
        await queryRunner.query(`ALTER TABLE "answer_alternative_alternative" DROP CONSTRAINT "FK_dedc535599d399cb86136c92228"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_b61949228eafdb00189ddc56b3a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3639d9ed266735b8fe0635bede2"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_86586021a26d1180b0968f98502"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`ALTER TABLE "sector" DROP CONSTRAINT "FK_2c911887cf103bd20e84d42b182"`);
        await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "FK_0ef0d37b964b6e83f07523e7904"`);
        await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "FK_e7c21930b8fd234e8b9242a045a"`);
        await queryRunner.query(`ALTER TABLE "answered_form" DROP CONSTRAINT "FK_4fc7b76775aad23acfe18b45f89"`);
        await queryRunner.query(`ALTER TABLE "answered_form" DROP CONSTRAINT "FK_3667f825e4d1a85982c6554f8cb"`);
        await queryRunner.query(`ALTER TABLE "answered_form" DROP CONSTRAINT "FK_552add7a604ab0bacd6818bc940"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_3e1fc24ea9ec602c86f62f48b8a"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`);
        await queryRunner.query(`ALTER TABLE "alternative" DROP CONSTRAINT "FK_987e598dc6447a20fa182141434"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_b34e93060feaa072950e872df2c"`);
        await queryRunner.query(`ALTER TABLE "health_score_config" DROP CONSTRAINT "FK_a0223c49f9a0c51cf4a8fec64d3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a34d5dcd15140f965e39fb1c40"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dedc535599d399cb86136c9222"`);
        await queryRunner.query(`DROP TABLE "answer_alternative_alternative"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "health_score"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "sector"`);
        await queryRunner.query(`DROP TABLE "form"`);
        await queryRunner.query(`DROP TABLE "answered_form"`);
        await queryRunner.query(`DROP TABLE "answer"`);
        await queryRunner.query(`DROP TABLE "alternative"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "form_schema"`);
        await queryRunner.query(`DROP TABLE "health_score_config"`);
    }

}
