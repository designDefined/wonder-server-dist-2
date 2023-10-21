"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockWonders = void 0;
const mongodb_1 = require("mongodb");
const samples_1 = require("../functions/samples");
const emptyObjectIdArray = [];
const emptyNumberArray = [];
exports.mockWonders = [
    {
        id: 4,
        title: "POWERPLANT 365C",
        thumbnail: samples_1.sampleImageURL.wonderWithThumbnail(4),
        summary: "24년 11월 6일 파워플랜트 파티에 여러분을 초대합니다 ",
        content: "",
        schedule: [new Date("2023-11-06T18:00:00")],
        location: {
            name: "파워플랜트",
            coordinates: { x: 4000, y: 500 },
            description: "서울대학교 68동 파워플랜트",
        },
        reservationProcess: {
            startsAt: new Date("2023-10-31T18:00:00"),
            endsAt: new Date("2023-11-06T18:00:00"),
        },
        dateInformation: {
            createdAt: new Date("2023-06-10"),
            lastModifiedAt: new Date("2023-06-10"),
        },
        creator: new mongodb_1.ObjectId("653270d1f4a3ba3f937faa31"),
        genre: "dance",
        likedUsers: emptyNumberArray,
        reservations: emptyObjectIdArray,
    },
    {
        id: 5,
        title: "미대극회 113회 공연 <작가를 찾는 6인의 등장인물>",
        thumbnail: samples_1.sampleImageURL.wonderWithThumbnail(5),
        summary: "",
        content: "",
        schedule: [
            new Date("2023-10-22T16:00:00"),
            new Date("2023-10-22T19:00:00"),
            new Date("2023-10-23T16:00:00"),
            new Date("2023-10-23T19:00:00"),
            new Date("2023-10-24T19:00:00"),
        ],
        location: {
            name: "74동 오디토리움",
            coordinates: { x: 4000, y: 500 },
            description: "서울대학교 74동 오디토리움",
        },
        reservationProcess: {
            startsAt: new Date("2023-10-01T00:00:00"),
            endsAt: new Date("2023-10-22T00:00:00"),
            phone: true,
            amount: 60,
        },
        dateInformation: {
            createdAt: new Date("2023-06-10"),
            lastModifiedAt: new Date("2023-06-10"),
        },
        creator: new mongodb_1.ObjectId("653270d1f4a3ba3f937faa32"),
        genre: "play",
        likedUsers: emptyNumberArray,
        reservations: emptyObjectIdArray,
    },
    {
        id: 6,
        title: "🎨미술대학 영상전🎞",
        thumbnail: samples_1.sampleImageURL.wonderWithThumbnail(6),
        summary: "미술대학에서 여러분을 영상전에 초대합니다!",
        content: "",
        schedule: [new Date("2023-11-23T16:00:00")],
        location: {
            name: "74동 오디토리움",
            coordinates: { x: 4000, y: 500 },
            description: "서울대학교 74동 오디토리움",
        },
        reservationProcess: null,
        dateInformation: {
            createdAt: new Date("2023-06-10"),
            lastModifiedAt: new Date("2023-06-10"),
        },
        creator: new mongodb_1.ObjectId("653270d1f4a3ba3f937faa33"),
        genre: "exhibition",
        likedUsers: emptyNumberArray,
        reservations: emptyObjectIdArray,
    },
    {
        id: 7,
        title: "🙆‍♂️향록연극회 정기공연 보러오세유~",
        thumbnail: samples_1.sampleImageURL.wonderWithThumbnail(7),
        summary: "제 86회 정기공연 '우리 무슨 사이야’",
        content: "",
        schedule: [
            new Date("2023-10-29T16:00:00"),
            new Date("2023-10-29T19:00:00"),
            new Date("2023-10-30T16:00:00"),
            new Date("2023-10-30T19:00:00"),
        ],
        location: {
            name: "서울대학교 두레문예관",
            coordinates: { x: 4000, y: 500 },
            description: "서울대학교 두레문예관",
        },
        reservationProcess: {
            startsAt: new Date("2023-10-10T00:00:00"),
            endsAt: new Date("2023-10-29T00:00:00"),
            amount: 50,
        },
        dateInformation: {
            createdAt: new Date("2023-06-10"),
            lastModifiedAt: new Date("2023-06-10"),
        },
        creator: new mongodb_1.ObjectId("653270d1f4a3ba3f937faa34"),
        genre: "play",
        likedUsers: emptyNumberArray,
        reservations: emptyObjectIdArray,
    },
    {
        id: 8,
        title: "[정보문화학 과제전] 꿈과 환상의 나라 정문랜드",
        thumbnail: samples_1.sampleImageURL.wonderWithThumbnail(8),
        summary: "꿈과 희망의 나라 <정문랜드>🎠",
        content: "",
        schedule: [
            new Date("2023-10-23"),
            new Date("2023-10-24"),
            new Date("2023-10-25"),
        ],
        location: {
            name: "IBK 커뮤니케이션 센터",
            coordinates: { x: 4000, y: 500 },
            description: "서울대학교 IBK 커뮤니케이션 센터",
        },
        reservationProcess: null,
        dateInformation: {
            createdAt: new Date("2023-06-10"),
            lastModifiedAt: new Date("2023-06-10"),
        },
        creator: new mongodb_1.ObjectId("653270d1f4a3ba3f937faa35"),
        genre: "exhibition",
        likedUsers: emptyNumberArray,
        reservations: emptyObjectIdArray,
    },
    {
        id: 9,
        title: "느티나무와 함께하는 텀블러 이벤트🌱",
        thumbnail: {
            src: "http://www.sobilife.com/news/photo/201810/15714_13913_418.jpg",
            altText: "느티나무 텀블러 이벤트",
        },
        summary: "느티나무 텀블러 판매 및 제조음료 할인 행사",
        content: "",
        schedule: [
            new Date("2023-10-19"),
            new Date("2023-10-20"),
            new Date("2023-10-21"),
            new Date("2023-10-22"),
            new Date("2023-10-23"),
        ],
        location: {
            name: "서울대학교 느티나무 도서관",
            coordinates: { x: 4000, y: 500 },
            description: "서울대학교 느티나무 도서관",
        },
        reservationProcess: null,
        dateInformation: {
            createdAt: new Date("2023-06-10"),
            lastModifiedAt: new Date("2023-06-10"),
        },
        creator: new mongodb_1.ObjectId("653270d1f4a3ba3f937faa36"),
        genre: "etc",
        likedUsers: emptyNumberArray,
        reservations: emptyObjectIdArray,
    },
];
