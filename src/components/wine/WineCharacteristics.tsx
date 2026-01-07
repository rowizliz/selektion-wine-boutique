import WineCharacteristicsBar from "./WineCharacteristicsBar";

interface WineCharacteristicsProps {
  characteristics: {
    sweetness: number;
    body: number;
    tannin: number;
    acidity: number;
    fizzy?: number | null;
  };
}

const WineCharacteristics = ({ characteristics }: WineCharacteristicsProps) => {
  const { sweetness, body, tannin, acidity, fizzy } = characteristics;

  return (
    <div className="space-y-3">
      <WineCharacteristicsBar label="Độ ngọt" value={sweetness} />
      <WineCharacteristicsBar label="Đậm đà" value={body} />
      <WineCharacteristicsBar label="Tannin" value={tannin} />
      <WineCharacteristicsBar label="Độ chua" value={acidity} />
      {fizzy !== null && fizzy !== undefined && fizzy > 0 && (
        <WineCharacteristicsBar label="Sủi bọt" value={fizzy} />
      )}
    </div>
  );
};

export default WineCharacteristics;
