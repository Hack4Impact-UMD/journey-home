"use client"

import { createInventoryRecord, search } from "@/lib/services/inventory";
import { InventoryRecordData, SearchParams } from "@/types/inventory";
import { Timestamp } from "firebase/firestore";
import { useEffect } from "react";

export default function FuncTestPage() {

    useEffect(() => {
        let testRecords: InventoryRecordData[] = [
            {
              name: "Modern Gray Sofa",
              thumbnail: { url: "https://example.com/sofa1.jpg", altText: "Gray 3-seater sofa" },
              otherPhotos: [
                { url: "https://example.com/sofa1-side.jpg", altText: "Side view" },
                { url: "https://example.com/sofa1-back.jpg", altText: "Back view" }
              ],
              category: "sofa",
              notes: "Excellent condition, pet-free home",
              quantity: 2,
              size: "Large",
              dateAdded: Timestamp.fromDate(new Date("2024-10-15"))
            },
            {
              name: "Oak Dining Table",
              thumbnail: { url: "https://example.com/table1.jpg", altText: "Wooden dining table" },
              otherPhotos: [],
              category: "table",
              notes: "Seats 6, minor scratches on top",
              quantity: 1,
              size: "Large",
              dateAdded: Timestamp.fromDate(new Date("2024-09-20"))
            },
            {
              name: "Blue Accent Chair",
              thumbnail: { url: "https://example.com/chair1.jpg", altText: "Blue velvet chair" },
              otherPhotos: [
                { url: "https://example.com/chair1-detail.jpg", altText: "Fabric detail" }
              ],
              category: "chair",
              notes: "Velvet fabric, needs cleaning",
              quantity: 4,
              size: "Small",
              dateAdded: Timestamp.fromDate(new Date("2024-10-01"))
            },
            {
              name: "Queen Size Bed Frame",
              thumbnail: { url: "https://example.com/bed1.jpg", altText: "Wooden bed frame" },
              otherPhotos: [
                { url: "https://example.com/bed1-headboard.jpg", altText: "Headboard detail" },
                { url: "https://example.com/bed1-side.jpg", altText: "Side view" }
              ],
              category: "bed",
              notes: "Mattress not included, solid construction",
              quantity: 1,
              size: "Large",
              dateAdded: Timestamp.fromDate(new Date("2024-10-18"))
            },
            {
              name: "Small Coffee Table",
              thumbnail: { url: "https://example.com/table2.jpg", altText: "Round coffee table" },
              otherPhotos: [],
              category: "table",
              notes: "Glass top, metal legs",
              quantity: 3,
              size: "Small",
              dateAdded: Timestamp.fromDate(new Date("2024-10-10"))
            },
            {
              name: "Leather Recliner",
              thumbnail: { url: "https://example.com/chair2.jpg", altText: "Brown leather recliner" },
              otherPhotos: [
                { url: "https://example.com/chair2-reclined.jpg", altText: "Reclined position" }
              ],
              category: "chair",
              notes: "Works perfectly, some wear on armrests",
              quantity: 2,
              size: "Medium",
              dateAdded: Timestamp.fromDate(new Date("2024-09-25"))
            },
            {
              name: "White Bookshelf",
              thumbnail: { url: "https://example.com/shelf1.jpg", altText: "5-shelf bookshelf" },
              otherPhotos: [],
              category: "shelf",
              notes: "Assembly required, all parts included",
              quantity: 5,
              size: "Medium",
              dateAdded: Timestamp.fromDate(new Date("2024-10-05"))
            },
            {
              name: "L-Shaped Sectional",
              thumbnail: { url: "https://example.com/sofa2.jpg", altText: "Gray sectional sofa" },
              otherPhotos: [
                { url: "https://example.com/sofa2-corner.jpg", altText: "Corner section" },
                { url: "https://example.com/sofa2-cushions.jpg", altText: "Cushion detail" }
              ],
              category: "sofa",
              notes: "Can be separated into two pieces",
              quantity: 1,
              size: "Large",
              dateAdded: Timestamp.fromDate(new Date("2024-10-20"))
            },
            {
              name: "Nightstand Set",
              thumbnail: { url: "https://example.com/nightstand1.jpg", altText: "Matching nightstands" },
              otherPhotos: [],
              category: "table",
              notes: "Sold as pair, two drawers each",
              quantity: 6,
              size: "Small",
              dateAdded: Timestamp.fromDate(new Date("2024-09-28"))
            },
            {
              name: "Office Desk Chair",
              thumbnail: { url: "https://example.com/chair3.jpg", altText: "Ergonomic office chair" },
              otherPhotos: [
                { url: "https://example.com/chair3-back.jpg", altText: "Back support" }
              ],
              category: "chair",
              notes: "Adjustable height, lumbar support",
              quantity: 8,
              size: "Medium",
              dateAdded: Timestamp.fromDate(new Date("2024-10-12"))
            },
            {
              name: "Twin Bunk Bed",
              thumbnail: { url: "https://example.com/bed2.jpg", altText: "White bunk bed" },
              otherPhotos: [
                { url: "https://example.com/bed2-ladder.jpg", altText: "Ladder view" }
              ],
              category: "bed",
              notes: "Includes safety rails, sturdy metal frame",
              quantity: 2,
              size: "Large",
              dateAdded: Timestamp.fromDate(new Date("2024-10-08"))
            },
            {
              name: "Floating Wall Shelves",
              thumbnail: { url: "https://example.com/shelf2.jpg", altText: "Set of 3 shelves" },
              otherPhotos: [],
              category: "shelf",
              notes: "Hardware included, easy install",
              quantity: 10,
              size: "Small",
              dateAdded: Timestamp.fromDate(new Date("2024-10-22"))
            },
            {
              name: "Loveseat Sofa",
              thumbnail: { url: "https://example.com/sofa3.jpg", altText: "Beige loveseat" },
              otherPhotos: [],
              category: "sofa",
              notes: "Two-seater, compact design",
              quantity: 3,
              size: "Medium",
              dateAdded: Timestamp.fromDate(new Date("2024-09-30"))
            },
            {
              name: "Standing Desk",
              thumbnail: { url: "https://example.com/table3.jpg", altText: "Adjustable standing desk" },
              otherPhotos: [
                { url: "https://example.com/table3-raised.jpg", altText: "Standing position" },
                { url: "https://example.com/table3-controls.jpg", altText: "Control panel" }
              ],
              category: "table",
              notes: "Electric height adjustment, memory presets",
              quantity: 2,
              size: "Medium",
              dateAdded: Timestamp.fromDate(new Date("2024-10-17"))
            },
            {
              name: "Folding Chairs",
              thumbnail: { url: "https://example.com/chair4.jpg", altText: "Black folding chairs" },
              otherPhotos: [],
              category: "chair",
              notes: "Space-saving, perfect for events",
              quantity: 15,
              size: "Small",
              dateAdded: Timestamp.fromDate(new Date("2024-10-03"))
            },
            {
              name: "King Size Bed",
              thumbnail: { url: "https://example.com/bed3.jpg", altText: "Upholstered king bed" },
              otherPhotos: [
                { url: "https://example.com/bed3-fabric.jpg", altText: "Fabric texture" }
              ],
              category: "bed",
              notes: "Gray upholstery, storage drawers underneath",
              quantity: 1,
              size: "Large",
              dateAdded: Timestamp.fromDate(new Date("2024-09-22"))
            },
            {
              name: "Corner TV Stand",
              thumbnail: { url: "https://example.com/shelf3.jpg", altText: "Corner entertainment unit" },
              otherPhotos: [],
              category: "shelf",
              notes: "Fits TVs up to 55 inches, cable management",
              quantity: 4,
              size: "Medium",
              dateAdded: Timestamp.fromDate(new Date("2024-10-14"))
            },
            {
              name: "Patio Lounge Sofa",
              thumbnail: { url: "https://example.com/sofa4.jpg", altText: "Outdoor wicker sofa" },
              otherPhotos: [
                { url: "https://example.com/sofa4-cushions.jpg", altText: "Weather-resistant cushions" }
              ],
              category: "sofa",
              notes: "Weather-resistant, includes cushions",
              quantity: 2,
              size: "Large",
              dateAdded: Timestamp.fromDate(new Date("2024-10-19"))
            },
            {
              name: "Bar Stools",
              thumbnail: { url: "https://example.com/chair5.jpg", altText: "Industrial bar stools" },
              otherPhotos: [],
              category: "chair",
              notes: "Metal frame, wooden seat, 30 inch height",
              quantity: 12,
              size: "Medium",
              dateAdded: Timestamp.fromDate(new Date("2024-10-07"))
            },
            {
              name: "Kid's Storage Cubes",
              thumbnail: { url: "https://example.com/shelf4.jpg", altText: "Colorful cube organizer" },
              otherPhotos: [
                { url: "https://example.com/shelf4-bins.jpg", altText: "Fabric bins included" }
              ],
              category: "shelf",
              notes: "9-cube organizer with fabric bins",
              quantity: 7,
              size: "Medium",
              dateAdded: Timestamp.fromDate(new Date("2024-10-11"))
            }
        ];
        testRecords = [];
        Promise.all(testRecords.map(record => createInventoryRecord(record)))
        .then(async ids => {
            console.log(await search("", {
                categories: [],
                sizes: [],
                ascending: false,
                sortBy: "Quantity",
            } as SearchParams))
        })
    }, []);

    return <></>;
}   