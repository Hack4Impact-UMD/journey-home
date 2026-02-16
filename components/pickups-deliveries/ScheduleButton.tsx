
//need to pass through donation request info + keep track of modal status
type ButtonProps = {
        // scheduleRequest: DonationRequest;
        onOpen: () => void;
    }

export default function ScheduleButton({ onOpen }: ButtonProps) {
    return (
        <div>
            <button onClick={onOpen} className="border-2 px-3">
            Schedule
            </button>
        </div>
    )
}