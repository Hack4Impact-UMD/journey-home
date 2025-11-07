'use client';

import { acceptRequestItem, deleteRequestItem, getDonationRequest, setDonationRequest } from '@/lib/services/donations';
import { DonationRequest, DonationItem } from '@/types/donations';
import { Timestamp } from 'firebase/firestore';

export default function testPage() {
    const testRequest: DonationRequest = {
            id: 'donation',
            donor: {
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                address: {
                    streetAddress: '',
                    city: '',
                    state: '',
                    zipCode: '',
                }
        },
        firstTimeDonor: true,
        howDidYouHear: '',
        canDropOff: true,
        notes: '',
        date: Timestamp.now(),
        items: [
            {
                item: {
                    id: 'item',
                    name: '',
                    photos: [],
                    category: '',
                    notes: '',
                    quantity: 1,
                    size: 'Small',
                    dateAdded: Timestamp.now(),
                    donorEmail: '',
                },
                status: 'Not Reviewed'
            }
        ]
    };

    console.log(testRequest)

    const handleAccept = async () => {
        await setDonationRequest(testRequest);
        await acceptRequestItem(testRequest.id, 'item');
        const updated = await getDonationRequest(testRequest.id);
        console.log(updated);
    };

    const handleReject = async () => {
        await setDonationRequest(testRequest);
        await deleteRequestItem(testRequest.id, 'item');
        const updated = await getDonationRequest(testRequest.id);
        console.log(updated);
    };

    return <>
        <h1>hi</h1>
        <div>
        <button onClick={handleAccept}>accept</button>
        </div>
        <div>
        <button onClick={handleReject}>reject</button>
        </div>
    </>;
}