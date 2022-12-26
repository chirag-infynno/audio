import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/AudioPlayer.module.css";
import { BsArrowLeftShort } from "react-icons/bs";
import { BsArrowRightShort } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { MdOutlineReplayCircleFilled } from "react-icons/md";

const highLights = [
  { startPosition: 30, endPosition: 45 },
  { startPosition: 40, endPosition: 70 },
  { startPosition: 20, endPosition: 40 },
];

const AudioPlayer = () => {
  const [startTime, setStartTime] = useState({
    hour: null,
    min: null,
    sec: null,
  });
  const [endTime, setEndTime] = useState({
    hour: null,
    min: null,
    sec: null,
  });
  const [blockList, setBlocakList] = useState([
    // {
    //   action: "Exercises ",
    //   endPosition: 13,
    //   id: 1,
    //   startPosition: 9,
    //   timeStampColor: "#FF0000",
    // },
    // {
    //   action: "Questions ",
    //   endPosition: 36,
    //   id: 2,
    //   startPosition: 19,
    //   timeStampColor: "#309c00",
    // },
    // {
    //   "startPosition": 43,
    //   "endPosition": 59,
    //  timeStampColor: "#fff40f",
    //  id: 3,
    //   "action": "Need Review ",
    // },
    // {
    //   "startPosition": 44,
    //   "endPosition": 50,
    //  timeStampColor: "#FF0000",
    //  id: 1,
    //   "action": "Exercises ",
    // },
    // [
    // ]
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [highLightBlocks, setHighLightBlocks] = useState([]);
  const [index, setindex] = useState(0);

  const [isReplay, setIsReplay] = useState(false);

  // references

  const [audio, setAudio] = useState();
  const audioPlayer = useRef(); // reference our audio component
  const progressBar = useRef(); // reference our progress bar
  const animationRef = useRef(); // reference the animation
  const [message, setMessage] = useState("");
  const [maxValue, setMaxValue] = useState();

  const uploadAudio = (e) => {
    var allowedExtensions =
      /(\.MP4|\.MOV|\.WMV|\.AVI|\.MKV|\.WEBM|\.M4A|\.FLAC|\.MP3|\.WAV|\.WMA|\.AAC)$/i;

    const audioExtensions = /(\.FLAC\.WMA|\.AAC)$/i;
    const videoExtensions = /(\.WMV|\.AVI|\.WEBM)$/i;

    if (allowedExtensions.exec(e.target.files[0]?.name)) {
      if (audioExtensions.exec(e.target.files[0]?.name)) {
        setMessage("Please Upload  .m4a .mp3 Audio File Only");
      }
      if (videoExtensions.exec(e.target.files[0]?.name)) {
        setMessage("Please Upload  .mP4 .mkv Video File Only");
      } else {
        setMessage("");
        setAudio(URL?.createObjectURL(e.target.files[0]));
      }
    } else {
      setMessage("Please Upload Audio/Video File");
    }
  };

  const calculateTime = (secs) => {
    // checkVideoOver(currentTime);
    // if(sec)
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const calculateTimeEnd = () => {
    // const secs = Math.floor(audioPlayer.current.duration);

    // console.log("get all sec", audioPlayer);
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };
  const [show, setShow] = useState(false);
  const togglePlayPause = () => {
    if (Number(currentTime) == duration) {
      // if (!prevValue) {
      console.log("aduido player", audioPlayer);

      audioPlayer.current.currentTime = 0;
      audioPlayer.current.play();
      // audioPlayer.current.play();
      // animationRef.current = requestAnimationFrame(whilePlaying);
      // }
    } else {
      const prevValue = isPlaying;
      setIsPlaying(!prevValue);
      if (!prevValue) {
        audioPlayer.current.play();
        animationRef.current = requestAnimationFrame(whilePlaying);
      } else {
        audioPlayer.current.pause();
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const backThirty = () => {
    progressBar.current.value = Number(progressBar.current.value - 30);
    changeRange();
  };

  const changeStartdate = (e) => {
    setStartTime({ ...startTime, [e.target.name]: e.target.value });
  };

  const changeEndTime = (e) => {
    setEndTime({ ...endTime, [e.target.name]: e.target.value });
  };

  const countNumber = (number) => {
    let hour = number?.hour * 3600 || 0;
    let min = number?.min * 60 || 0;
    let sec = Number(number?.sec) + Number(min) + Number(hour);
    return sec;
  };

  const getBlockPositions = (highLightItemData) => {
    console.log("index", index);
    const find = highLightBlocks.filter((data) => {
      if (data.id !== highLightItemData.id) {
        return {
          ...data,
        };
      }
    });

    console.log("index", index);
    if (find.length === highLightBlocks.length) {
      console.log("find ");

      const getSelectdData = blockList.filter((data) => {
        return data.id === highLightItemData.id;
      });

      console.log("getSelectdData");
      if (getSelectdData.length > 0) {
        let listdata = getSelectdData?.map((highLightItem) => {
          let leftSpace = Math.trunc(
            (highLightItem?.startPosition * progressBar.current.offsetWidth) /
              duration
          );
          let endPosition = Math.trunc(
            (highLightItem?.endPosition * progressBar.current.offsetWidth) /
              duration
          );
          let blockWidth = endPosition - leftSpace;
          return {
            leftSpace: leftSpace,
            blockWidth: blockWidth,
            timeStampColor: highLightItem.timeStampColor,
            id: highLightItem.id,
            index: highLightItem.index + 1 || index + 1,
          };
        });

        setHighLightBlocks([...listdata, ...highLightBlocks]);

        setindex(index + 1);
      }
    } else {
      let changeIndex = find.map((data) => {
        return {
          ...data,
          index: data.index !== 1 ? data.index - 1 : data.index,
        };
      });

      if (index > 1) {
        setindex(index - 1);
      } else {
        setindex(0);
      }
      setHighLightBlocks(changeIndex);
    }
  };

  const addExercises = (details) => {
    let startime = countNumber(startTime);
    let endtime = countNumber(endTime);

    if (startime < endtime && duration > startime && duration >= endtime) {
      const exist = blockList.filter((data) => {
        if (
          (startime >= data?.startPosition &&
            startime <= data?.endPosition &&
            data?.action === details?.action) ||
          (endtime >= data?.startPosition &&
            endtime <= data?.endPosition &&
            data?.action === details?.action) ||
          (startime <= data?.startPosition &&
            endtime >= data?.endPosition &&
            data?.action === details?.action)
        ) {
          return data;
        }
      });

      if (exist?.length > 0) {
        setMessage(details?.action.replace("s", "") + "Time is Exsits");
      } else {
        setBlocakList([
          ...blockList,
          {
            startPosition: startime,
            endPosition: endtime,
            timeStampColor: details.color,
            id: details.id,
            action: details.action,
          },
        ]);

        setStartTime({
          hour: 0,
          min: 0,
          sec: 0,
        });

        setEndTime({
          hour: 0,
          min: 0,
          sec: 0,
        });
        setMessage("");
        alert(details.message + "Time is added");
      }
    } else {
      setMessage("Please Enter Valid Time");
    }
  };

  const calculateEndTime = () => {};
  const submtImage = () => {
    // const seconds = Math.floor(audioPlayer.current.duration);
    // setDuration(seconds);
    // progressBar.current.max = seconds;

    setShow(true);

    // setAudio(e);
  };

  useEffect(() => {
    setTimeout(() => {
      const seconds = Math.floor(audioPlayer?.current?.duration);
      setDuration(seconds);
      setMaxValue(seconds);
    }, 300);
  }, [highLightBlocks, audio, duration, show]);

  // useEffect(() => {
  //   // setTimeout(() => {
  //   //   const seconds = Math.floor(audioPlayer?.current?.duration);
  //   //   setDuration(seconds);
  //   //   setMaxValue(seconds);
  //   // }, 300);

  // }, [audioPlayer?.current?.value]);

  const forwardThirty = () => {
    progressBar.current.value = Number(progressBar.current.value + 30);
    changeRange();
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };
  const moveTo = (e) => {
    console.log("audio size", progressBar.current.offsetWidth);
    let time;
    time =
      (e.target.parentElement.offsetLeft +
        e.target.parentElement.parentElement.offsetLeft -
        e.clientX) /
      (progressBar.current.offsetWidth / duration);
    progressBar.current.value = Math.abs(Math.floor(time));
    changeRange();
  };

  const suuget = (e) => {
    e.stopPropagation();
    let time;
    time =
      (e.target.parentElement.parentElement.offsetLeft +
        e.target.parentElement.parentElement.parentElement.offsetLeft -
        e.clientX) /
      (progressBar.current.offsetWidth / duration);
    progressBar.current.value = Math.abs(Math.floor(time));
    changeRange();
  };

  if (typeof document !== "undefined") {
    // console.log("aslncjb");

    window.onresize = () => {
      console.log("audioPlayer", audioPlayer);
      console.log(window.innerWidth);
    };
    document.onscroll = () => {
      // window.pageYOffset > position?.current?.offsetParent?.offsetTop
      //   ? setSticky(true)
      //   : setSticky(false);
      console.log("asmcl");
    };
  }
  return (
    <>
      {!show && (
        <div className="flex justify-center flex-col items-center">
          <div className="flex flex-col gap-[12px]">
            <div>Upload Audio/Video</div>
            {message && <div className="text-red-600">{message}</div>}
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={uploadAudio}
            />

            {audio && (
              <div>
                <button
                  onClick={submtImage}
                  className="bg-blue-500 px-2 py-2 text-white rounded-sm border-[1px]"
                >
                  Upload Audio/Video
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {show && (
        <div>
          <div className="flex flex-col md:flex-row  md:justify-between gap-20 md:gap-0 w-full xl:max-w-[1440xp]  xl:pr-20 px-4">
            <div className="flex  relative flex-col gap-1">
              <video
                ref={audioPlayer}
                src={audio}
                className="max-h-[326px] w-[575px] md:w-full"
                preload="metadata"
              ></video>
              <div
                className="absolute w-full max-w-[570px]  cursor-pointer bottom-16 "
                onClick={(e) => moveTo(e)}
              >
                <input
                  type="range"
                  className={styles.progressBar}
                  defaultValue={0}
                  ref={progressBar}
                  max={maxValue}
                />
                <div className={styles.seekBar}>
                  {highLightBlocks?.map((data, index) => (
                    <div
                      key={index}
                      className={styles.seekBar1}
                      style={{
                        width: `${data.blockWidth}px`,
                        height: "70%",
                        left: `${data.leftSpace}px`,
                        backgroundColor: `${data.timeStampColor}`,
                        position: "absolute",
                        opacity: 0.6,
                        zIndex: data.index,
                        cursor: "pointer",
                      }}
                      onClick={(e) => suuget(e)}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center border-[1px] border-black items-center max-w-[157px] relative">
                <button onClick={togglePlayPause} className={styles.playPause}>
                  {Number(currentTime) !== duration ? (
                    isPlaying ? (
                      <FaPause />
                    ) : (
                      <FaPlay />
                    )
                  ) : (
                    <MdOutlineReplayCircleFilled />
                  )}
                </button>
                <div>
                  {calculateTime(currentTime)}/{/* </div> */}
                  {duration && !isNaN(duration) && calculateTime(duration)}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-1 grid-cols-2 gap-5  md: h-max">
              <button
                className=" bg-[#FF00FF]  py-2 px-2 lg:w-56 md:w-40 h-10"
                onClick={() => {
                  getBlockPositions({ id: 4 });
                }}
              >
                Call To Action
              </button>

              <button
                className=" bg-[#FF0000]  py-2 px-2 lg:w-56 md:w-40 h-10"
                onClick={() => {
                  getBlockPositions({ id: 1 });
                }}
              >
                Exercises
              </button>
              <button
                className=" bg-[#309c00]  py-2 px-2 lg:w-56 md:w-40 h-10"
                onClick={() => getBlockPositions({ id: 2 })}
              >
                Questions
              </button>
              <button
                className=" bg-[#fff40f]  py-2 px-2 lg:w-56 md:w-40 h-10"
                onClick={() => getBlockPositions({ id: 3 })}
              >
                Need Review
              </button>

              <button
                className=" bg-[#40E0D0]  py-2 px-2 lg:w-56 md:w-40 h-10"
                onClick={() => getBlockPositions({ id: 5 })}
              >
                Insight
              </button>
            </div>
          </div>

          <div className="mt-20 relative px-4">
            <div className="absolute text-red-500 top-[50px] left-[50px]">
              {message}
            </div>
            <div className="flex flex-col md:gap-11 gap-7">
              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <div className="startpositon">
                  <div> Start Time</div>
                  <div className="flex gap-1">
                    {duration > 3600 && (
                      <div>
                        <input
                          type="number"
                          name="hour"
                          min={0}
                          max={23}
                          placeholder=" HH"
                          className="border-[1px] border-solid border-black  focus:outline-none "
                          value={startTime.hour}
                          onChange={changeStartdate}
                        />
                      </div>
                    )}
                    {duration > 60 && (
                      <div>
                        <input
                          type="number"
                          name="min"
                          min={0}
                          max={59}
                          value={startTime.min}
                          placeholder=" MM"
                          onChange={changeStartdate}
                          className="border-[1px] border-solid border-black  focus:outline-none "
                        />
                      </div>
                    )}

                    <div>
                      <input
                        type="number"
                        name="sec"
                        min={0}
                        // max={60}
                        value={startTime.sec}
                        placeholder=" SS"
                        max={59}
                        onChange={changeStartdate}
                        className="border-[1px] border-solid border-black  focus:outline-none "
                      />
                    </div>
                  </div>
                </div>
                <div className="startpositon">
                  <div> End Time</div>

                  <div className="flex gap-1">
                    {duration > 3600 && (
                      <div>
                        <input
                          type="number"
                          name="hour"
                          min={0}
                          max={24}
                          placeholder=" HH"
                          value={endTime.hour}
                          onChange={changeEndTime}
                          className="border-[1px] border-solid border-black  focus:outline-none "
                        />
                      </div>
                    )}
                    {duration > 60 && (
                      <div>
                        <input
                          type="number"
                          name="min"
                          min={0}
                          max={59}
                          value={endTime.min}
                          placeholder=" MM"
                          onChange={changeEndTime}
                          className="border-[1px] border-solid border-black  focus:outline-none "
                        />
                      </div>
                    )}
                    <div>
                      <input
                        type="number"
                        name="sec"
                        min={0}
                        max={59}
                        value={endTime.sec}
                        placeholder=" SS"
                        onChange={changeEndTime}
                        className="border-[1px] border-solid border-black  focus:outline-none "
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="grid xl:grid-cols-5 gap-5    md:grid-cols-3  grid-cols-2"
                // style={{
                //   display: "flex",
                //   gap: 10,
                // }}
              >
                <button
                  style={{
                    backgroundColor: "#FF00FF",
                  }}
                  className="sm:whitespace-nowrap px-5 py-3"
                  // className={styles.buttonStyle}
                  onClick={() =>
                    addExercises({
                      id: 4,
                      color: "#FF66FF",
                      message: "Call To Action",
                      action: "callToAction",
                    })
                  }
                >
                  Add Call To Action Time
                </button>

                <button
                  style={{
                    backgroundColor: "#FF0000",
                  }}
                  // className="sm:whitespace-nowrap"
                  className="sm:whitespace-nowrap px-5 py-3"
                  // className={styles.buttonStyle}
                  onClick={() =>
                    addExercises({
                      id: 1,
                      color: "#FF6666",
                      message: "Exercises Time",
                      action: "Exercises ",
                    })
                  }
                >
                  Add Exercises Time
                </button>
                <button
                  style={{
                    backgroundColor: "#309c00",
                  }}
                  // className="sm:whitespace-nowrap"
                  className="sm:whitespace-nowrap px-5 py-3  w-full max-w-lg"
                  // className={styles.buttonStyle}
                  onClick={() =>
                    addExercises({
                      id: 2,
                      color: "#66ff66",
                      message: "Questions Time",
                      action: "Questions ",
                    })
                  }
                >
                  Add Questions Time
                </button>
                <button
                  style={{
                    backgroundColor: "#fff40f",
                  }}
                  className="sm:whitespace-nowrap px-5 py-3 "
                  // className={styles.buttonStyle}
                  onClick={() =>
                    addExercises({
                      id: 3,
                      color: "#fff40f",
                      message: "Review Time",
                      action: "Need Review ",
                    })
                  }
                >
                  Add Need Review Time
                </button>

                <button
                  style={{
                    backgroundColor: "#40E0D0",
                  }}
                  className="sm:whitespace-nowrap px-5 py-3"
                  // className={styles.buttonStyle}
                  onClick={() =>
                    addExercises({
                      id: 5,
                      color: "#40E0D0",
                      message: "Insight Time",
                      action: "Insight ",
                    })
                  }
                >
                  Add Insight Time
                </button>
              </div>
            </div>
          </div>
          <div className="mt-28 px-4">
            <table>
              <tr>
                <th>Index</th>
                <th>Startime</th>
                <th>EndTime</th>
                <th>Action</th>
              </tr>

              {blockList.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{calculateTime(data.startPosition)}</td>{" "}
                  <td>{calculateTime(data.endPosition)}</td>
                  <td
                    style={{
                      backgroundColor: data.timeStampColor,
                    }}
                    onClick={() => {}}
                  >
                    {data.action}
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export { AudioPlayer };
