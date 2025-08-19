import { useRouter } from "next/router";
import Prediction from "../../components/Prediction";
import PredictionDetails from "../../components/PredictionDetails";

export default function PredictionPage(){
    const router = useRouter();
    const {id} = router.query
    console.log("id", id)
        return <PredictionDetails predictionId={id} />
}