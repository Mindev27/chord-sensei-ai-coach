import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Play, Pause, RefreshCw } from "lucide-react";
import GuitarTabNotation, { TabNote } from "./GuitarTabNotation";
import GuitarFretboardWithScaleDisplay from "./GuitarFretboardWithScaleDisplay";
import GuitarChordDiagram from "./GuitarChordDiagram";
import { getChordPositionsByDifficulty } from "@/utils/chordUtils";

// Mock recording data
interface Recording {
  id: string;
  title: string;
  artist: string;
  duration: number;
  thumbnailUrl: string;
}

// Mock analysis segment
interface AnalysisSegment {
  id: string;
  startTime: number;
  endTime: number;
  analysis: string;
  refArtist?: string;
  refSong?: string;
  scale: string;
  scaleForm: string;
  key: string;
  section: string;
  tabNotes: TabNote[];
}

// Mock recordings
const MOCK_RECORDINGS: Recording[] = [
  {
    id: "back-in-anger",
    title: "Don't Look Back in Anger",
    artist: "Oasis",
    duration: 249000, // 4:09 in milliseconds
    thumbnailUrl: "/images/gravity.jpg"
  },
  {
    id: "slow-dancing",
    title: "Slow Dancing in a Burning Room",
    artist: "John Mayer",
    duration: 242000, // 4:02 in milliseconds
    thumbnailUrl: "/images/slow-dancing.jpg"
  },
  {
    id: "highlight",
    title: "Highlight",
    artist: "터치드",
    duration: 198000, // 3:18 in milliseconds
    thumbnailUrl: "/images/highlight.jpg"
  },
  {
    id: "out-of-my-mind",
    title: "Out of My Mind",
    artist: "John Mayer",
    duration: 276000, // 4:36 in milliseconds
    thumbnailUrl: "/images/out-of-my-mind.jpg"
  }
];

// Mock analysis segments for Gravity
const GRAVITY_SEGMENTS: AnalysisSegment[] = [
  {
    id: "gravity-1",
    startTime: 0,
    endTime: 30000,
    analysis: "G 메이저 키의 I-IV-V 진행에서 코드톤을 강조한 연주로, 3음과 7음(가이드톤)을 중심으로 한 선율 라인이 특징적입니다. 메이저 펜타토닉에 믹솔리디안 모드의 7음을 더한 접근으로, D7 코드에서 F 음(b7)을 강조하여 블루지한 색채를 표현했습니다.",
    refArtist: "B.B. King",
    scale: "G Major Pentatonic",
    scaleForm: "2번 폼",
    key: "G",
    section: "Introduction",
    tabNotes: [
      { string: 1, fret: 15, duration: 250, position: 0 },
      { string: 1, fret: 12, duration: 250, position: 1 },
      { string: 2, fret: 15, duration: 250, position: 2 },
      { string: 2, fret: 12, duration: 250, position: 3 },
      { string: 1, fret: 15, duration: 500, position: 4 }
    ]
  },
  {
    id: "gravity-2",
    startTime: 30001,
    endTime: 60000,
    analysis: "G 블루스 스케일과 G 메이저 스케일의 하이브리드 접근법으로, Bb(b3)과 B(♮3)을 교차 사용하여 텐션과 해결의 순환 구조를 형성했습니다. 특히 D7 코드에서는 알터레이션된 9음(Eb, F#)을 활용한 상향 크로매틱 라인이 특징적입니다.",
    refArtist: "Stevie Ray Vaughan",
    scale: "G Blues Scale / G Major",
    scaleForm: "1번 폼",
    key: "G",
    section: "Verse Solo",
    tabNotes: [
      { string: 3, fret: 10, duration: 250, position: 0 },
      { string: 3, fret: 8, duration: 250, position: 1 },
      { string: 4, fret: 10, duration: 250, position: 2 },
      { string: 3, fret: 7, duration: 250, position: 3 },
      { string: 2, fret: 8, duration: 500, position: 4 }
    ]
  },
  {
    id: "gravity-3",
    startTime: 60001,
    endTime: 90000,
    analysis: "Em7 코드 위에서 G 메이저 스케일의 6도(E-C)와 3도(G-B) 인터벌을 활용한 멜로딕 접근법이 특징적입니다. 이는 Em7의 코드 구성음(E, G, B, D)을 효과적으로 타겟팅하면서 9음(F#)과 13음(C)의 텐션을 더하는 방식입니다.",
    refArtist: "Derek Trucks",
    scale: "G Major / E Minor",
    scaleForm: "3번 폼",
    key: "G",
    section: "Bridge Solo",
    tabNotes: [
      { string: 2, fret: 13, duration: 250, position: 0 },
      { string: 2, fret: 15, duration: 250, position: 1 },
      { string: 1, fret: 12, duration: 250, position: 2 },
      { string: 1, fret: 15, duration: 250, position: 3 },
      { string: 1, fret: 17, duration: 500, position: 4 }
    ]
  },
  {
    id: "gravity-4",
    startTime: 90001,
    endTime: 120000,
    analysis: "D 믹솔리디안 모드를 활용한 프레이즈로, G 메이저의 V도 코드(D7)에 대한 적합한 스케일 선택입니다. 특히 C 음(b7)을 강조하면서도 F# 음(메이저 3도)과의 조화를 통해 도미넌트 7th의 특성을 선명하게 드러냅니다.",
    refArtist: "John Mayer",
    scale: "D Mixolydian",
    scaleForm: "5번 폼",
    key: "G",
    section: "Main Solo",
    tabNotes: [
      { string: 3, fret: 12, duration: 250, position: 0 },
      { string: 3, fret: 14, duration: 250, position: 1 },
      { string: 2, fret: 12, duration: 250, position: 2 },
      { string: 2, fret: 15, duration: 250, position: 3 },
      { string: 1, fret: 13, duration: 500, position: 4 }
    ]
  },
  {
    id: "gravity-5",
    startTime: 120001,
    endTime: 150000,
    analysis: "G7 코드 타겟팅과 크로매틱 접근음을 결합한 블루스 프레이징으로, 코드 구성음(G, B, D, F)을 중심으로 반음계적 패싱 톤과 인클로저(enclosure) 기법을 적용했습니다. 특히 F(b7)에서 E(13)로의 해결이 자주 등장하는 것이 특징입니다.",
    refArtist: "Eric Clapton",
    scale: "G Blues",
    scaleForm: "2번 폼",
    key: "G",
    section: "Chorus Solo",
    tabNotes: [
      { string: 1, fret: 8, duration: 250, position: 0 },
      { string: 1, fret: 10, duration: 250, position: 1 },
      { string: 2, fret: 8, duration: 250, position: 2 },
      { string: 2, fret: 10, duration: 250, position: 3 },
      { string: 3, fret: 7, duration: 500, position: 4 }
    ]
  },
  {
    id: "gravity-6",
    startTime: 150001,
    endTime: 249000,
    analysis: "G 블루스와 메이저 펜타토닉의 하이브리드 접근법으로, 클라이맥스에서는 D7 코드에 대한 알터 스케일(D7alt) 요소를 부분적으로 차용했습니다. 특히 Ab(b5), Eb(b9), F#(#9) 등의 변화음을 통해 텐션을 극대화한 후 최종적으로 G 메이저의 3음인 B로 해결하는 구조입니다.",
    refArtist: "John Mayer",
    scale: "G Blues / G Major Pentatonic",
    scaleForm: "4번 폼",
    key: "G",
    section: "Outro Solo",
    tabNotes: [
      { string: 1, fret: 19, duration: 250, position: 0 },
      { string: 1, fret: 22, duration: 250, position: 1 },
      { string: 1, fret: 24, duration: 250, position: 2 },
      { string: 2, fret: 22, duration: 250, position: 3 },
      { string: 2, fret: 19, duration: 500, position: 4 }
    ]
  }
];

// Mock analysis segments for Slow Dancing
const SLOW_DANCING_SEGMENTS: AnalysisSegment[] = [
  {
    id: "slow-dancing-1",
    startTime: 0,
    endTime: 60000,
    analysis: "C#m 펜타토닉의 블루 노트(G)를 활용한 프레이징으로, vi-IV-I-V 코드 진행에서 임시 조성 중심(temporary tonal center)으로서 C#m을 활용했습니다. 특히 G#(5음)과 G(b5)의 반음계적 대비를 통해 블루지한 색채를 강조했습니다.",
    scale: "C# Minor Pentatonic",
    scaleForm: "1번 폼",
    key: "C#m",
    section: "Intro Solo",
    tabNotes: [
      { string: 2, fret: 9, duration: 250, position: 0 },
      { string: 2, fret: 12, duration: 250, position: 1 },
      { string: 1, fret: 9, duration: 250, position: 2 },
      { string: 1, fret: 12, duration: 250, position: 3 },
      { string: 2, fret: 9, duration: 500, position: 4 }
    ]
  },
  {
    id: "slow-dancing-2",
    startTime: 60001,
    endTime: 120000,
    analysis: "C# 도리안 모드(A 메이저 스케일의 3번째 모드)를 활용했으며, 특히 A(6음)을 강조하는 것이 특징입니다. C#m7-G#m7 진행에서 G#m7을 iv로 인식하여 화성적 단조(harmonic minor)의 요소를 부분적으로 차용한 접근법입니다.",
    refArtist: "John Mayer",
    scale: "C# Dorian Mode",
    scaleForm: "2번 폼",
    key: "C#m",
    section: "Verse Fill",
    tabNotes: [
      { string: 3, fret: 11, duration: 250, position: 0 },
      { string: 3, fret: 13, duration: 250, position: 1 },
      { string: 2, fret: 11, duration: 250, position: 2 },
      { string: 2, fret: 14, duration: 250, position: 3 },
      { string: 1, fret: 11, duration: 500, position: 4 }
    ]
  },
  {
    id: "slow-dancing-3",
    startTime: 120001,
    endTime: 180000,
    analysis: "E 메이저 스케일(C#m의 관계조)의 첫 번째 테트라코드(E-F#-G#-A)를 중심으로 한 어센딩 패턴입니다. 브릿지 섹션의 E-B-A 진행에서 각 코드의 루트와 3음을 타겟팅하는 스케일 기반 아르페지오 접근법이 사용되었습니다.",
    scale: "E Major",
    scaleForm: "3번 폼",
    key: "C#m",
    section: "Bridge",
    tabNotes: [
      { string: 4, fret: 9, duration: 250, position: 0 },
      { string: 4, fret: 11, duration: 250, position: 1 },
      { string: 3, fret: 9, duration: 250, position: 2 },
      { string: 3, fret: 11, duration: 250, position: 3 },
      { string: 2, fret: 9, duration: 500, position: 4 }
    ]
  },
  {
    id: "slow-dancing-4",
    startTime: 180001,
    endTime: 242000,
    analysis: "C#m 펜타토닉과 B 메이저 스케일(C#m의 VII도)을 혼합한 하이브리드 접근법으로, 특히 D#(메이저 9음)을 스케일 외 음으로 추가하여 텐션을 더했습니다. 클라이맥스에서는 G#m7-C#m7-F#7-B의 ii-v-I 케이던스에 대응하여 각 코드의 어벨러블 텐션을 활용한 선율 진행이 특징적입니다.",
    refArtist: "John Mayer",
    scale: "C# Minor Pentatonic/B Major",
    scaleForm: "4번 폼",
    key: "C#m",
    section: "Ending Solo",
    tabNotes: [
      { string: 1, fret: 16, duration: 250, position: 0 },
      { string: 1, fret: 19, duration: 250, position: 1 },
      { string: 1, fret: 17, duration: 250, position: 2 },
      { string: 2, fret: 19, duration: 250, position: 3 },
      { string: 2, fret: 16, duration: 500, position: 4 }
    ]
  }
];

// Mock analysis segments for Highlight
const HIGHLIGHT_SEGMENTS: AnalysisSegment[] = [
  {
    id: "highlight-1",
    startTime: 120000,
    endTime: 140000,
    analysis: "A 메이저 펜타토닉 스케일을 기반으로 한 순차적 시퀀싱 패턴으로, 각 코드 변화에 대응하여 D 메이저(IV도)와 E7(V7) 코드의 구성음을 효과적으로 타겟팅했습니다. 특히 E7 코드에서는 G#(메이저 3음)과 D(b7)의 대비를 통해 도미넌트 특성을 강조했습니다.",
    refArtist: "Joe Bonamassa",
    scale: "A Major Pentatonic",
    scaleForm: "4번 폼",
    key: "A",
    section: "Guitar Solo",
    tabNotes: [
      { string: 1, fret: 5, duration: 125, position: 0 },
      { string: 1, fret: 7, duration: 125, position: 1 },
      { string: 1, fret: 5, duration: 125, position: 2 },
      { string: 2, fret: 8, duration: 125, position: 3 },
      { string: 2, fret: 5, duration: 125, position: 4 },
      { string: 3, fret: 7, duration: 125, position: 5 },
      { string: 3, fret: 5, duration: 125, position: 6 },
      { string: 4, fret: 7, duration: 125, position: 7 }
    ]
  }
];

// Mock analysis segments for Out of My Mind
const OUT_OF_MY_MIND_SEGMENTS: AnalysisSegment[] = [
  {
    id: "out-of-my-mind-1",
    startTime: 90000,
    endTime: 110000,
    analysis: "G 블루스 스케일을 기반으로 한 턴어라운드 패턴으로, I-IV-V-I(G-C-D7-G) 진행의 마지막 부분에서 D7의 b7(C)에서 G의 3음(B)으로 해결하는 가이드톤 라인이 특징적입니다. 특히 D7 코드에서 F(b3)와 F#(♮3)을 오가는 크로매틱 접근법이 블루지한 색채를 더합니다.",
    refSong: "Cannonball Shuffle",
    scale: "G Blues Scale",
    scaleForm: "3번 폼",
    key: "G",
    section: "Interlude",
    tabNotes: [
      { string: 4, fret: 3, duration: 250, position: 0 },
      { string: 3, fret: 0, duration: 250, position: 1 },
      { string: 4, fret: 5, duration: 250, position: 2 },
      { string: 3, fret: 2, duration: 250, position: 3 },
      { string: 2, fret: 3, duration: 500, position: 4 }
    ]
  }
];

// Combine all segments into a map
const RECORDING_ANALYSIS_MAP: Record<string, AnalysisSegment[]> = {
  "gravity": GRAVITY_SEGMENTS,
  "slow-dancing": SLOW_DANCING_SEGMENTS,
  "highlight": HIGHLIGHT_SEGMENTS,
  "out-of-my-mind": OUT_OF_MY_MIND_SEGMENTS
};

interface RecordingAnalysisProps {
  difficultyLevel?: "상" | "중" | "하";
}

// Mock analysis variations by section type
const ANALYSIS_VARIATIONS = {
  "intro": [
    "인트로에서는 I-IV-V 진행을 따라 코드 아르페지오를 사용했습니다. 코드의 3음과 7음을 강조하며 화성적 진행을 명확히 표현합니다.",
    "베이스 노트에 대한 5도 음정을 사용한 파워 코드 기반 인트로입니다. 루트와 5음 위주의 연주로 단순하지만 강렬한 화성 구조를 형성합니다.",
    "인트로는 ii-V-I 재즈 진행을 활용하여 각 코드의 9음과 13음을 강조한 텐션 보이싱으로 구성되어 있습니다.",
    "도미넌트 7th 코드의 알터레이션을 활용한 인트로로, b9, #9, b13 등의 텐션 노트로 독특한 색채감을 부여했습니다.",
    "메이저 7th와 마이너 9th 코드를 교차 사용하여 모달 인터체인지 기법이 돋보이는 인트로 섹션입니다."
  ],
  "verse": [
    "버스 섹션에서는 2-5-1 케이던스를 기반으로 코드톤을 타겟팅한 선율 진행이 특징적입니다. 각 코드의 가이드톤(3음, 7음)을 효과적으로 연결했습니다.",
    "이 부분에서는 도리안 모드를 기반으로 한 마이너 펜타토닉 스케일에 메이저 6음을 추가하여 재즈적 색채를 더했습니다.",
    "버스 섹션의 화성 진행은 I-vi-IV-V의 고전적 순환 진행이며, 각 코드의 아르페지오를 활용한 보이싱이 두드러집니다.",
    "마이너 ii-V-i 진행에 트라이톤 대리(tritone substitution)를 활용하여 크로매틱한 베이스 라인을 형성했습니다.",
    "페달 포인트 위에 서스펜디드 코드 진행을 배치한 구조로, 4음과 2음의 텐션과 해결이 반복되는 패턴이 특징적입니다."
  ],
  "chorus": [
    "코러스는 IV-V-iii-vi 진행의 변형으로, 세컨더리 도미넌트(secondary dominant)를 활용하여 각 코드로의 이동을 강조했습니다.",
    "코드톤 위주의 선율에 패싱 톤(passing tone)과 어프로치 노트(approach note)를 적절히 배치한 화성적 연결이 특징입니다.",
    "코러스에서 사용된 리듬 패턴은 싱커페이션된 16분음표 패턴으로, 다운비트 대신 업비트에 코드톤을 배치하여 긴장감을 형성합니다.",
    "메이저 스케일과 메이저 펜타토닉 스케일을 혼합하여 사용하며, 특히 4음과 7음 사이의 하프 스텝(half-step) 진행이 두드러집니다.",
    "코러스의 화성 구조는 순환적 3도 진행(cycle of thirds)을 기반으로 하며, 이는 베이스 라인과 대위법적 관계를 형성합니다."
  ],
  "bridge": [
    "브릿지 섹션에서는 메이저에서 평행단조(parallel minor)로의 전환이 일어나며, 이 과정에서 도리안 모드의 특징음인 메이저 6음을 활용했습니다.",
    "부속화음(secondary dominant)과 이탈리안 6th 코드를 활용한 브릿지로, 증4도(#11)와 단6도(b13)의 텐션을 강조했습니다.",
    "증6화음(augmented sixth chord)을 활용한 브릿지 섹션으로, 특히 독일식 6th 코드가 도미넌트로 해결되는 진행이 특징적입니다.",
    "브릿지에서는 4도 순환(cycle of fourths) 진행을 활용하여 조성 중심을 일시적으로 변화시키는 이조(modulation) 기법이 사용되었습니다.",
    "브릿지의 하모닉 리듬(harmonic rhythm)이 2배로 가속화되어, 코드 변화의 빈도가 높아지며 텐션이 증가하는 구조입니다."
  ],
  "solo": [
    "솔로 섹션에서는 믹솔리디안 모드를 기반으로 하되, 플랫 3(b3)과 내추럴 3(♮3)을 교차 사용하는 블루스적 접근이 두드러집니다.",
    "코드 스케일 관계를 충실히 반영한 솔로로, 각 코드의 어벨러블 텐션(available tension)을 선율적으로 강조했습니다.",
    "솔로에서는 디미니쉬드 스케일과 온음 스케일을 교차 사용하여 상이한 코드 구조 위에서 통일된 음색을 유지하는 기법이 돋보입니다.",
    "II-V-I 진행 위에서 베복(bebop) 스케일을 활용한 크로매틱 패싱 톤과 인클로저(enclosure) 기법이 특징적입니다.",
    "알터 스케일(altered scale)을 활용한 솔로로, 특히 b9, #9, b5, #5 등의 변화음을 통해 도미넌트 코드의 텐션을 극대화했습니다."
  ],
  "outro": [
    "아웃트로에서는 원조로의 회귀 과정에서 이중 도미넌트(secondary dominant)를 활용한 데셉티브 케이던스(deceptive cadence)가 사용되었습니다.",
    "종지(cadence)에 앞서 서브도미넌트 마이너(subdominant minor) 코드를 차용하여 모달 인터체인지적 색채를 더했습니다.",
    "아웃트로의 최종 해결에서는 V7sus4에서 V7로의 진행을 통해 텐션의 해소와 함께 토닉으로 자연스럽게 귀결됩니다.",
    "피카르디 3도(Picardy third)를 활용하여 마이너 조성에서 메이저 토닉으로 해결하는 고전적 종지 기법이 사용되었습니다.",
    "아웃트로에서는 베이스의 페달포인트 위에 ii-V의 진행을 반복하다 최종적으로 I로 해결하는 확장된 케이던스 구조를 보입니다."
  ]
};

// Mock technique suggestions
const TECHNIQUE_SUGGESTIONS = [
  "멜로딕 마이너 스케일의 5번째 모드인 믹솔리디안 b6을 활용하여 도미넌트 코드의 b13 텐션을 강조해보세요.",
  "II-V-I 진행에서 코드톤을 타겟팅할 때 3음과 7음으로 구성된 가이드톤 라인(guide tone line)을 의식적으로 연결해보세요.",
  "도미넌트 7th 코드에서 알터 스케일(7th mode of melodic minor)을 적용하여 b9, #9, b5, #5 등 다양한 텐션을 표현해보세요.",
  "트라이애드 페어(triad pairs) 기법을 활용하여 두 개의 서로 다른 3화음을 결합한 6음 스케일을 생성해보세요.",
  "코드 톤 솔로잉에서 어프로치 패턴(approach pattern)을 활용하여 반음계적 접근음으로 코드톤을 강조해보세요.",
  "슈퍼임포지션(superimposition) 기법을 통해 기존 코드 진행 위에 다른 코드의 아르페지오를 중첩시켜 폴리코드(polychord) 효과를 만들어보세요.",
  "옥타브 변위(octave displacement)를 활용하여 동일한 스케일 패턴도 음역대 이동을 통해 새로운 선율 라인으로 발전시켜보세요.",
  "페달 톤(pedal tone) 기법을 활용하여 변화하는 코드 진행 위에서 일정한 기준점을 유지하는 연주를 시도해보세요."
];

// Mock practice tips
const PRACTICE_TIPS = [
  "각 코드의 아르페지오를 모든 포지션에서 연습하여 코드톤에 대한 지판 전체의 이해도를 높이세요.",
  "메트로놈을 2박과 4박에만 두고 연습하여 약박(weak beat)에서의 리듬 감각을 향상시키세요.",
  "모든 조성에서 II-V-I 진행을 연습하되, 가이드톤(3음, 7음)의 움직임에 집중하여 화성적 연결성을 체득하세요.",
  "단일 포지션 내에서 여러 모드(이오니안, 도리안, 프리지안 등)를 전환하며 연주하는 연습을 통해 모달 즉흥연주 능력을 향상시키세요.",
  "코드 진행을 녹음한 후, 먼저 베이스 라인만 연주하고, 다음으로 코드톤만 연주하는 단계적 접근으로 화성 구조에 대한 이해를 깊게 하세요.",
  "한 코드에서 다음 코드로 이동할 때 최소한의 음 이동으로 연결하는 보이싱 연습을 통해 경제적인 화성 진행 감각을 익히세요."
];

const RecordingAnalysis = ({ difficultyLevel = "중" }: RecordingAnalysisProps) => {
  const [selectedRecording, setSelectedRecording] = useState<Recording>(MOCK_RECORDINGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(15000); // Start at 15 seconds for example
  const [currentSegment, setCurrentSegment] = useState<AnalysisSegment | null>(GRAVITY_SEGMENTS[0]);
  const [analysisUpdateCounter, setAnalysisUpdateCounter] = useState(0);
  const [lastAnalysisUpdateTime, setLastAnalysisUpdateTime] = useState(0); // Track last update time
  const [currentChord, setCurrentChord] = useState<string>("G");
  const [previousChord, setPreviousChord] = useState<string>("C");
  
  // Find the current segment based on current time
  const findCurrentSegment = (time: number, recordingId: string): AnalysisSegment | null => {
    const segments = RECORDING_ANALYSIS_MAP[recordingId] || [];
    return segments.find(segment => time >= segment.startTime && time <= segment.endTime) || null;
  };
  
  // Format milliseconds to MM:SS
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Handle play/pause
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    
    // Find the current segment if we don't have one
    if (!currentSegment) {
      const segment = findCurrentSegment(currentTime, selectedRecording.id);
      if (segment) setCurrentSegment(segment);
    }
  };
  
  // Skip to previous segment
  const goToPreviousSegment = () => {
    const segments = RECORDING_ANALYSIS_MAP[selectedRecording.id] || [];
    const currentIndex = segments.findIndex(segment => segment.id === currentSegment?.id);
    
    if (currentIndex > 0) {
      const prevSegment = segments[currentIndex - 1];
      setCurrentSegment(prevSegment);
      setCurrentTime(prevSegment.startTime + 1000); // Start 1 second into the segment
      setAnalysisUpdateCounter(0); // Reset the update counter
      setLastAnalysisUpdateTime(prevSegment.startTime + 1000); // Reset last update time
    }
  };
  
  // Skip to next segment
  const goToNextSegment = () => {
    const segments = RECORDING_ANALYSIS_MAP[selectedRecording.id] || [];
    const currentIndex = segments.findIndex(segment => segment.id === currentSegment?.id);
    
    if (currentIndex < segments.length - 1) {
      const nextSegment = segments[currentIndex + 1];
      setCurrentSegment(nextSegment);
      setCurrentTime(nextSegment.startTime + 1000); // Start 1 second into the segment
      setAnalysisUpdateCounter(0); // Reset the update counter
      setLastAnalysisUpdateTime(nextSegment.startTime + 1000); // Reset last update time
    }
  };
  
  // Simulate playback and update current segment
  useEffect(() => {
    let playbackTimer: number;
    
    if (isPlaying) {
      // Initialize currentSegment if not set
      if (!currentSegment) {
        const segment = findCurrentSegment(currentTime, selectedRecording.id);
        if (segment) setCurrentSegment(segment);
      }
      
      // Update the chord progression initially
      updateChordProgression(currentTime, currentSegment);
      
      // Set up a timer to update currentTime during playback
      playbackTimer = window.setInterval(() => {
        // Update the current time (simulate playback)
        setCurrentTime(prevTime => {
          const newTime = prevTime + 1000; // Advance 1 second
          
          // Stop at the end of the recording
          if (newTime >= selectedRecording.duration) {
            setIsPlaying(false);
            return selectedRecording.duration;
          }
          
          // Check if we need to update the current segment
          const newSegment = findCurrentSegment(newTime, selectedRecording.id);
          if (newSegment && newSegment.id !== currentSegment?.id) {
            setCurrentSegment(newSegment);
            setAnalysisUpdateCounter(0); // Reset counter when segment changes
            setLastAnalysisUpdateTime(newTime); // Reset last update time
          }
          
          // Update chord progression
          updateChordProgression(newTime, newSegment || currentSegment);
          
          // Check if 5 seconds have passed since last analysis update
          if (Math.floor(newTime / 5000) > Math.floor(lastAnalysisUpdateTime / 5000)) {
            setAnalysisUpdateCounter(prev => (prev + 1) % 6); // Cycle through 0-5 for more varied content
            setLastAnalysisUpdateTime(newTime); // Update last analysis time
          }
          
          return newTime;
        });
      }, 1000); // Update every second
    }
    
    return () => {
      if (playbackTimer) window.clearInterval(playbackTimer);
    };
  }, [isPlaying, currentSegment, currentTime, selectedRecording, lastAnalysisUpdateTime]);
  
  // Select a different recording
  const handleRecordingSelect = (recording: Recording) => {
    setSelectedRecording(recording);
    setIsPlaying(false);
    setAnalysisUpdateCounter(0);
    setLastAnalysisUpdateTime(0);
    const firstSegment = (RECORDING_ANALYSIS_MAP[recording.id] || [])[0];
    if (firstSegment) {
      setCurrentSegment(firstSegment);
      setCurrentTime(firstSegment.startTime + 1000);
      
      // Reset chord progression based on new recording
      if (recording.id === "gravity") {
        setCurrentChord("G");
        setPreviousChord("C");
      } else if (recording.id === "slow-dancing") {
        setCurrentChord("Am");
        setPreviousChord("E");
      } else if (recording.id === "highlight") {
        setCurrentChord("A");
        setPreviousChord("E7");
      } else {
        setCurrentChord("G");
        setPreviousChord("D7");
      }
    } else {
      setCurrentSegment(null);
      setCurrentTime(0);
      setCurrentChord("C");
      setPreviousChord("G");
    }
  };
  
  // Generate dynamic analysis content based on the counter
  const getDynamicAnalysisContent = () => {
    if (!currentSegment) return null;
    
    // Get section type based on current segment's section name
    const getSectionType = (sectionName: string) => {
      const lowerSection = sectionName.toLowerCase();
      if (lowerSection.includes('intro')) return 'intro';
      if (lowerSection.includes('verse')) return 'verse';
      if (lowerSection.includes('chorus')) return 'chorus';
      if (lowerSection.includes('bridge')) return 'bridge';
      if (lowerSection.includes('solo')) return 'solo';
      if (lowerSection.includes('outro')) return 'outro';
      return 'solo'; // default to solo for other section names
    };
    
    const sectionType = getSectionType(currentSegment.section);
    
    // Get analysis variations for the current section
    const analysisOptions = ANALYSIS_VARIATIONS[sectionType] || ANALYSIS_VARIATIONS.solo;
    
    // Get analysis based on counter
    const analysisIndex = analysisUpdateCounter % analysisOptions.length;
    const currentAnalysis = analysisOptions[analysisIndex];
    
    // Get technique suggestion based on counter
    const techniqueIndex = (analysisUpdateCounter + 2) % TECHNIQUE_SUGGESTIONS.length;
    const techniqueSuggestion = TECHNIQUE_SUGGESTIONS[techniqueIndex];
    
    // Get practice tip based on counter and time
    const tipIndex = (analysisUpdateCounter + Math.floor(currentTime / 10000)) % PRACTICE_TIPS.length;
    const practiceTip = PRACTICE_TIPS[tipIndex];
    
    // Add scale information from the current segment
    const scaleInfo = `현재 스케일: ${currentSegment.scale} (${currentSegment.scaleForm})`;
    
    return (
      <>
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-400 mb-1">연주 분석</h3>
          <p className="text-md leading-relaxed">{currentAnalysis}</p>
          <p className="text-xs text-gray-400 mt-2">{scaleInfo}</p>
        </div>
        
        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-400 mb-1">테크닉 제안</h3>
          <p className="text-md leading-relaxed text-sensei-accent">{techniqueSuggestion}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">연습 팁</h3>
          <p className="text-sm text-gray-300 italic">{practiceTip}</p>
        </div>
      </>
    );
  };
  
  // Update chords based on time and segment
  const updateChordProgression = (time: number, segment: AnalysisSegment | null) => {
    if (!segment) return;
    
    // Get chord progression based on recording ID and segment
    let newCurrentChord = "G";
    let newPreviousChord = "C";
    
    if (selectedRecording.id === "gravity") {
      // Gravity chord progressions by segment
      if (segment.id === "gravity-1") {
        // Intro: G-C-D7
        const segmentTime = time - segment.startTime;
        if (segmentTime < 10000) {
          newCurrentChord = "G";
          newPreviousChord = "C";
        } else if (segmentTime < 20000) {
          newCurrentChord = "C";
          newPreviousChord = "G";
        } else {
          newCurrentChord = "D7";
          newPreviousChord = "C";
        }
      } else if (segment.id === "gravity-2" || segment.id === "gravity-5") {
        // Verse and Chorus: G-D7-Em-C
        const segmentTime = (time - segment.startTime) % 30000;
        if (segmentTime < 7500) {
          newCurrentChord = "G";
          newPreviousChord = "C";
        } else if (segmentTime < 15000) {
          newCurrentChord = "D7";
          newPreviousChord = "G";
        } else if (segmentTime < 22500) {
          newCurrentChord = "Em";
          newPreviousChord = "D7";
        } else {
          newCurrentChord = "C";
          newPreviousChord = "Em";
        }
      } else if (segment.id === "gravity-3") {
        // Bridge: Em-C-G-D
        const segmentTime = (time - segment.startTime) % 30000;
        if (segmentTime < 7500) {
          newCurrentChord = "Em";
          newPreviousChord = "D7";
        } else if (segmentTime < 15000) {
          newCurrentChord = "C";
          newPreviousChord = "Em";
        } else if (segmentTime < 22500) {
          newCurrentChord = "G";
          newPreviousChord = "C";
        } else {
          newCurrentChord = "D7";
          newPreviousChord = "G";
        }
      } else {
        // Default: G-C-D7
        const segmentTime = (time - segment.startTime) % 30000;
        if (segmentTime < 10000) {
          newCurrentChord = "G";
          newPreviousChord = "C";
        } else if (segmentTime < 20000) {
          newCurrentChord = "C";
          newPreviousChord = "G";
        } else {
          newCurrentChord = "D7";
          newPreviousChord = "C";
        }
      }
    } else if (selectedRecording.id === "slow-dancing") {
      // Slow Dancing chord progressions: C#m-A-B-E
      const segmentTime = (time - segment.startTime) % 30000;
      if (segmentTime < 7500) {
        newCurrentChord = "Am";
        newPreviousChord = "E";
      } else if (segmentTime < 15000) {
        newCurrentChord = "G";
        newPreviousChord = "Am";
      } else if (segmentTime < 22500) {
        newCurrentChord = "F";
        newPreviousChord = "G";
      } else {
        newCurrentChord = "E";
        newPreviousChord = "F";
      }
    } else {
      // Default progression for other songs: G-C-D-G
      const segmentTime = (time - segment.startTime) % 20000;
      if (segmentTime < 5000) {
        newCurrentChord = "G";
        newPreviousChord = "D7";
      } else if (segmentTime < 10000) {
        newCurrentChord = "C";
        newPreviousChord = "G";
      } else if (segmentTime < 15000) {
        newCurrentChord = "D7";
        newPreviousChord = "C";
      } else {
        newCurrentChord = "G";
        newPreviousChord = "D7";
      }
    }
    
    // Update chord state if changed
    if (newCurrentChord !== currentChord) {
      setPreviousChord(currentChord);
      setCurrentChord(newCurrentChord);
    }
  };
  
  return (
    <div className="flex flex-col gap-4 p-4">
        {/* Chord progression display with diagrams */}
        <div className="mb-4">
            <h3 className="text-lg font-medium mb-3">현재 코드 진행</h3>
            <div className="flex flex-wrap gap-4 justify-center">
                {previousChord && (
                <div className="chord-display bg-gray-800 p-3 rounded-lg opacity-70">
                    <div className="text-sm text-gray-400 text-center mb-1">이전 코드</div>
                    <GuitarChordDiagram 
                    chordName={previousChord} 
                    positions={getChordPositionsByDifficulty(previousChord, difficultyLevel)} 
                    />
                    <div className="mt-2 flex justify-between items-center">
                    <div className="flex gap-1">
                        <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">{previousChord}</span>
                        {previousChord === "C" && (
                        <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">Cmaj</span>
                        )}
                        {previousChord === "Am" && (
                        <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">VIm</span>
                        )}
                        {previousChord === "G" && (
                        <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">V</span>
                        )}
                        {previousChord === "E7" && (
                        <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">III7</span>
                        )}
                        {previousChord === "F" && (
                        <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">IV</span>
                        )}
                    </div>
                    </div>
                </div>
                )}
                
                <div className="chord-display bg-gray-800 p-3 rounded-lg border-2 border-sensei-accent">
                <div className="text-sm text-sensei-accent text-center mb-1">현재 코드</div>
                <GuitarChordDiagram 
                    chordName={currentChord} 
                    positions={getChordPositionsByDifficulty(currentChord, difficultyLevel)} 
                />
                <div className="mt-2 flex justify-between items-center">
                    <div className="flex gap-1">
                    <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">{currentChord}</span>
                    {currentChord === "C" && (
                        <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">Cmaj</span>
                    )}
                    {currentChord === "Am" && (
                        <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">VIm</span>
                    )}
                    {currentChord === "G" && (
                        <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">V</span>
                    )}
                    {currentChord === "E7" && (
                        <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">III7</span>
                    )}
                    {currentChord === "F" && (
                        <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">IV</span>
                    )}
                    </div>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/70 text-white">
                    {difficultyLevel}
                    </span>
                </div>
                </div>
                
                {/* 다음 코드는 현재 시간에 따라 동적으로 결정됨 */}
                <div className="chord-display bg-gray-800 p-3 rounded-lg opacity-70">
                <div className="text-sm text-gray-400 text-center mb-1">다음 코드</div>
                <GuitarChordDiagram 
                    chordName={currentChord === previousChord ? "G" : previousChord} 
                    positions={getChordPositionsByDifficulty(currentChord === previousChord ? "G" : previousChord, difficultyLevel)} 
                />
                <div className="mt-2 flex justify-between items-center">
                    <div className="flex gap-1">
                    <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">
                        {currentChord === previousChord ? "G" : previousChord}
                    </span>
                    {(currentChord === previousChord ? "G" : previousChord) === "C" && (
                        <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">Cmaj</span>
                    )}
                    {(currentChord === previousChord ? "G" : previousChord) === "Am" && (
                        <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">VIm</span>
                    )}
                    {(currentChord === previousChord ? "G" : previousChord) === "G" && (
                        <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">V</span>
                    )}
                    {(currentChord === previousChord ? "G" : previousChord) === "E7" && (
                        <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">III7</span>
                    )}
                    {(currentChord === previousChord ? "G" : previousChord) === "F" && (
                        <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-white">IV</span>
                    )}
                    </div>
                    </div>
                </div>
            </div>
        </div>
              

      {/* Top playback controls */}
      <Card className="bg-gray-900 border-gray-800 w-full">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="min-w-48">
              <h3 className="font-medium">{selectedRecording.title}</h3>
              <p className="text-sm text-gray-400">{selectedRecording.artist}</p>
            </div>
            
            <div className="flex-grow">
              {/* Timeline */}
              <div className="w-full bg-gray-800 h-2 rounded-full mb-1 relative">
                <div 
                  className="absolute h-2 bg-sensei-accent rounded-full" 
                  style={{ 
                    width: `${(currentTime / selectedRecording.duration) * 100}%` 
                  }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(selectedRecording.duration)}</span>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-transparent border-gray-700 hover:bg-gray-800"
                onClick={goToPreviousSegment}
                disabled={!currentSegment}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="default" 
                size="icon" 
                className="bg-sensei-accent hover:bg-sensei-accent/90 h-10 w-10"
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-transparent border-gray-700 hover:bg-gray-800"
                onClick={goToNextSegment}
                disabled={!currentSegment}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            
            {currentSegment && (
              <Badge variant="outline" className="bg-transparent border-sensei-accent text-sensei-accent">
                {currentSegment.section}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Analysis content - full width */}
      <Card className="bg-gray-900 border-gray-800 w-full">
        
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">음원 연주 분석</CardTitle>
        </CardHeader>
        <CardContent>
          {currentSegment ? (
            <div className="space-y-4">
              {/* Playback time indicator */}
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span className="font-medium">현재 시간: {formatTime(currentTime)}</span>
                <span>구간: {formatTime(currentSegment.startTime)} - {formatTime(currentSegment.endTime)}</span>
              </div>
              {/* Analysis text */}
              <div className={`bg-gray-800 p-4 rounded-md border ${isPlaying ? 'border-sensei-accent' : 'border-gray-700'} relative`}>
                {isPlaying && (
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full bg-sensei-accent animate-pulse`}></div>
                    <span className="text-xs text-sensei-accent">실시간 분석 중</span>
                  </div>
                )}
                
                {getDynamicAnalysisContent()}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <p>연주 분석을 위해 재생 버튼을 누르세요</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordingAnalysis;