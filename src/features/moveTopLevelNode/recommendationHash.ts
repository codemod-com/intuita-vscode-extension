import { buildHash } from "../../utilities";

export type RecommendationHash = string & { __type: 'RecommendationHash' };

export const buildRecommendationHash = (
    fileName: string,
    oldIndex: number,
    newIndex: number,
): RecommendationHash => {
    const data = {
        fileName,
        oldIndex,
        newIndex,
    };

    const hash = buildHash(
        JSON.stringify(data),
    );

    return hash as RecommendationHash;
}
