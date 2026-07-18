import { GraphQLScalarType, Kind } from "graphql";

export const LocalDateScalar = new GraphQLScalarType({
    name: "LocalDate",
    description: "Retorna apenas a data no formato YYYY-MM-DD",

    // 1. Quando o dado SAI do banco/backend para o GraphQL Client
    serialize(value: any): string {
        if (value instanceof Date) {
            // Extrai o ano, mês e dia diretamente em UTC para evitar o fuso de Brasília!
            const year = value.getUTCFullYear();
            const month = String(value.getUTCMonth() + 1).padStart(2, '0');
            const day = String(value.getUTCDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        if (typeof value === "string") {
            return value.split("T")[0]; // Se já for string, pega apenas a data
        }
        throw new Error("LocalDateScalar can only serialize Date objects or ISO strings");
    },

    // 2. Quando o dado ENTRA via variáveis na mutation/query (String "YYYY-MM-DD")
    parseValue(value: any): Date {
        if (typeof value === "string") {
            return new Date(`${value}T00:00:00Z`); // Converte para Date UTC
        }
        throw new Error("LocalDateScalar can only parse string values");
    },

    // 3. Quando o dado entra inline na query do GraphQL
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(`${ast.value}T00:00:00Z`);
        }
        return null;
    },
});