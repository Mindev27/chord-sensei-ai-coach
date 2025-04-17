import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ChevronRight, Music, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ScaleRecommendation {
  name: string;
  notes: string;
  confidence: number;
}

interface SoloAnalysisProps {
  currentChord: string;
  feedback: string;
  scaleRecommendations: ScaleRecommendation[];
  playbackTime: number;
}

const SoloAnalysis = ({ 
  currentChord, 
  feedback, 
  scaleRecommendations,
  playbackTime 
}: SoloAnalysisProps) => {
  const [activeTab, setActiveTab] = useState<"feedback" | "scales" | "licks">("feedback");
  
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const recommendedLicks = [
    {
      name: "BBKing 벤딩 스타일",
      description: "BBKing 스타일의 단음 벤딩으로 강한 표현력을 더함",
      level: "초급",
    },
    {
      name: "John Mayer 스타일 더블스탑",
      description: "Slow Dancing의 더블스탑 벤딩을 활용한 표현",
      level: "중급",
    },
    {
      name: "SRV 블루스 터닝 포인트",
      description: "텍사스 블루스의 전형적인 포지션 전환 패턴",
      level: "고급",
    }
  ];

  return (
    <div className="p-4 h-full overflow-auto">
      <div className="flex mb-4 space-x-2">
        <div className="bg-gray-800 text-gray-200 px-3 py-1 rounded-md flex items-center gap-2 text-sm">
          <span>현재 코드:</span>
          <Badge className="bg-sensei-accent">{currentChord}</Badge>
        </div>
        <div className="bg-gray-800 text-gray-200 px-3 py-1 rounded-md flex items-center gap-2 text-sm">
          <span>재생 시간:</span>
          <span className="font-mono">{formatTime(playbackTime)}</span>
        </div>
        <div className="bg-gray-800 text-gray-200 px-3 py-1 rounded-md flex items-center gap-2 text-sm">
          <span>난이도:</span>
          <span className="text-yellow-400">중급</span>
        </div>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab("feedback")}
          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
            activeTab === "feedback" ? "bg-sensei-accent text-white" : "bg-gray-800 text-gray-200"
          }`}
        >
          <Radio size={16} />
          연주 피드백
        </button>
        <button
          onClick={() => setActiveTab("scales")}
          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
            activeTab === "scales" ? "bg-sensei-accent text-white" : "bg-gray-800 text-gray-200"
          }`}
        >
          <Music size={16} />
          추천 스케일
        </button>
        <button
          onClick={() => setActiveTab("licks")}
          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
            activeTab === "licks" ? "bg-sensei-accent text-white" : "bg-gray-800 text-gray-200"
          }`}
        >
          <BarChart size={16} />
          추천 릭
        </button>
      </div>
      
      {activeTab === "feedback" && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Radio className="mr-2 h-5 w-5 text-sensei-accent" />
              실시간 피드백
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-fade-in">
              <p className="text-gray-200">{feedback}</p>
              
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-medium text-gray-300">현재 연주 분석</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-sensei-accent mr-1 mt-0.5 flex-shrink-0" />
                    <span>E7 코드의 특성음(G#)을 강조하는 연주가 긍정적입니다.</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-sensei-accent mr-1 mt-0.5 flex-shrink-0" />
                    <span>12~15프렛 구간에서 B 마이너 펜타토닉을 활용하고 있습니다.</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-yellow-500 mr-1 mt-0.5 flex-shrink-0" />
                    <span>F#음이 E7 코드에서 불협화음을 발생시킵니다. G#으로 대체하세요.</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {activeTab === "scales" && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Music className="mr-2 h-5 w-5 text-sensei-accent" />
              추천 스케일
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scaleRecommendations.map((scale, index) => (
                <div key={index} className="bg-gray-700 p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{scale.name}</h3>
                    <Badge className={`
                      ${scale.confidence > 90 ? 'bg-green-600' : 
                        scale.confidence > 80 ? 'bg-yellow-600' : 
                        'bg-orange-600'}`
                      }
                    >
                      {scale.confidence}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 font-mono mt-1">{scale.notes}</p>
                  <div className="mt-2 flex gap-2">
                    {scale.name === "E Mixolydian" && (
                      <span className="text-xs px-2 py-0.5 bg-sensei-accent/20 text-sensei-accent rounded">현재 코드 E7에 최적</span>
                    )}
                    {scale.name === "E Blues" && (
                      <span className="text-xs px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded">블루스 느낌 강조</span>
                    )}
                    {scale.name === "A Minor Pentatonic" && (
                      <span className="text-xs px-2 py-0.5 bg-purple-600/20 text-purple-400 rounded">대체 접근법</span>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="bg-gray-700/50 p-3 rounded-md">
                <h3 className="font-medium flex items-center">
                  <span>스케일 탐색기</span>
                  <Badge className="ml-2 bg-gray-600">Pro</Badge>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  모든 코드와 호환되는 스케일을 탐색하고, 도미넌트, 디미니쉬드, 크로매틱 접근법 등을 발견하세요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {activeTab === "licks" && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-sensei-accent" />
              추천 릭 & 프레이즈
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedLicks.map((lick, index) => (
                <div key={index} className="bg-gray-700 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{lick.name}</h3>
                    <Badge className={`
                      ${lick.level === "초급" ? "bg-green-600" : 
                        lick.level === "중급" ? "bg-yellow-600" : 
                        "bg-red-600"}
                    `}>
                      {lick.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{lick.description}</p>
                  <button className="mt-2 text-xs text-sensei-accent flex items-center">
                    릭 연습하기
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </button>
                </div>
              ))}
              
              <div className="mt-3 text-center py-2">
                <p className="text-sm text-gray-400">
                  현재 코드 진행에 맞는 릭을 더 보려면 <span className="text-sensei-accent underline cursor-pointer">프로 버전으로 업그레이드</span>하세요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SoloAnalysis;
