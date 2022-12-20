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
    //   "timeStampColor": "#fff40f",
    //   "id": 3,
    //   "action": "Need Review ",
    // },
    // {
    //   "startPosition": 44,
    //   "endPosition": 50,
    //   "timeStampColor": "#FF0000",
    //   "id": 1,
    //   "action": "Exercises ",
    // },
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
    console.log("a", e.target.files[0]?.name);

    var allowedExtensions =
      /(\.MP4|\.MOV|\.WMV|\.AVI|\.MKV|\WEBM|\.M4A|\.FLAC|\.MP3|\.WAV|\.WMA|\.AAC)$/i;

    const audioExtensions = /(\.FLAC\.WMA|\.AAC)$/i;
    const videoExtensions = /(\.WMV|\.AVI|\WEBM)$/i;

    if (allowedExtensions.exec(e.target.files[0]?.name)) {
      if (audioExtensions.exec(e.target.files[0]?.name)) {
        setMessage("Please Upload  .M4A .MP3 Audio File Only");
      }
      if (videoExtensions.exec(e.target.files[0]?.name)) {
        setMessage("Please Upload  .MP4 .mkv Video File Only");
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
    const find = highLightBlocks.filter((data) => {
      if (data.id !== highLightItemData.id) {
        return {
          ...data,
        };
      }
    });
    if (find.length === highLightBlocks.length) {
      console.log("find ");

      const getSelectdData = blockList.filter((data) => {
        return data.id === highLightItemData.id;
      });

      console.log("get all data", getSelectdData);

      let listdata = getSelectdData?.map((highLightItem) => {
        let leftSpace = Math.trunc(
          (highLightItem?.startPosition * 570) / duration
        );
        let endPosition = Math.trunc(
          (highLightItem?.endPosition * 570) / duration
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
      // console.log("listdata", listdata);
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

  //   console.log("nakscnkn");
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
    console.log(e);
    console.log(
      "asll",
      e.target.parentElement.offsetLeft,
      e.target.parentElement.parentElement.offsetLeft,
      e.screenX
    );

    let time;
    time =
      (e.target.parentElement.offsetLeft +
        e.target.parentElement.parentElement.offsetLeft -
        e.clientX) /
      (570 / duration);
    progressBar.current.value = Math.abs(Math.floor(time));
    console.log("time", time);

    changeRange();
  };

  const suuget = (e) => {
    e.stopPropagation();
    let time;
    time =
      (e.target.parentElement.parentElement.offsetLeft +
        e.target.parentElement.parentElement.parentElement.offsetLeft -
        e.clientX) /
      (570 / duration);
    progressBar.current.value = Math.abs(Math.floor(time));
    changeRange();
  };

  return (
    <>
      {!show && (
        <div>
          <div>Upload Audio/Video</div>
          {message && (
            <div
              style={{
                color: "red",
                marginTop: 10,
                marginBottom: 5,
              }}
            >
              {message}
            </div>
          )}
          <input
            type="file"
            style={{
              marginTop: 10,
            }}
            // accept="audio/*,video/*"
            onChange={uploadAudio}
          />

          {/* {audio && ( */}
          <div>
            <button
              onClick={submtImage}
              style={{
                marginTop: 10,
              }}
            >
              Upload Audio/Video
            </button>
          </div>
          {/* )} */}
        </div>
      )}

      {show && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              className={styles.audioPlayer}
              style={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <video
                ref={audioPlayer}
                src={audio}
                preload="metadata"
                style={{
                  height: 326,
                }}
              ></video>
              <div
                className={styles.mainRange}
                style={{
                  position: "absolute",
                  top: 300,
                  width: 570,
                  cursor: "pointer",
                }}
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
                        height: "60%",
                        left: `${data.leftSpace}px`,
                        backgroundColor: `${data.timeStampColor}`,
                        position: "absolute",
                        opacity: 0.7,
                        zIndex: data.index,
                        cursor: "pointer",
                      }}
                      onClick={(e) => suuget(e)}
                      // onClick={}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.buttonlist}>
              <button
                style={{
                  backgroundColor: "#FF00FF",
                  paddingLeft: 50,
                  paddingRight: 50,
                }}
                className={styles.buttonStyle}
                onClick={() => {
                  getBlockPositions({ id: 4 });
                }}
              >
                Call To Action
              </button>
              <button
                style={{
                  backgroundColor: "#FF0000",
                }}
                className={styles.buttonStyle}
                onClick={() => {
                  getBlockPositions({ id: 1 });
                }}
              >
                Exercises
              </button>
              <button
                style={{
                  backgroundColor: "#309c00",
                }}
                className={styles.buttonStyle}
                onClick={() => getBlockPositions({ id: 2 })}
              >
                Questions
              </button>
              <button
                className={styles.buttonStyle}
                style={{
                  backgroundColor: "#fff40f",
                }}
                onClick={() => getBlockPositions({ id: 3 })}
              >
                Need Review
              </button>

              <button
                className={styles.buttonStyle}
                style={{
                  backgroundColor: "#40E0D0",
                }}
                onClick={() => getBlockPositions({ id: 5 })}
              >
                Insight
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyItems: "center",
              marginLeft: 62,
              border: "1px solid black",
              maxWidth: 157,
              marginTop: 10,
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* <button className={styles.forwardBackward} onClick={backThirty}>
              <BsArrowLeftShort /> 30
            </button> */}
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
              {/* play now */}
            </button>
            {/* <div className={styles.currentTime}> */}
            <div>
              {calculateTime(currentTime)}/{/* </div> */}
              {/* <div className={styles.duration}> */}
              {/* {calculateEndTime(duration)} */}
              {/* {calculateTimeEnd()} */}
              {duration && !isNaN(duration) && calculateTime(duration)}
            </div>
            {/* </div> */}
            {/* <button className={styles.forwardBackward} onClick={forwardThirty}>
              30 <BsArrowRightShort />
            </button> */}
            {/* current time */}
            {/* progress bar */}
            {/* <div className="progress-4 relative">
              {highLightBlocks.length > 0 &&
                highLightBlocks.map((highLightBlock) => {
                  if (highLightBlock.leftSpace || highLightBlock.blockWidth) {
                    let blockStyle = `w-[${highLightBlock.blockWidth}px] left-[${highLightBlock.leftSpace}px] `;
                    return (
                      <div
                        // width={highLightBlock.blockWidth + "px"}

                        className={`progress ${blockStyle}`}
                      ></div>
                    );
                  }
                  return null;
                })}
            </div> */}
            {/* duration */}
          </div>

          <div
            className="custom"
            style={{
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                color: "red",
                top: "50px",
                left: 50,
              }}
            >
              {message}
            </div>
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 40,
                marginLeft: 50,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <div className="startpositon">
                  <div> Start Time</div>
                  <div className="alllabel">
                    {duration > 3600 && (
                      <div>
                        <input
                          type="number"
                          name="hour"
                          min={0}
                          max={23}
                          placeholder="HH"
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
                          placeholder="MM"
                          onChange={changeStartdate}
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
                        placeholder="SS"
                        max={59}
                        onChange={changeStartdate}
                      />
                    </div>
                  </div>
                </div>
                <div className="startpositon">
                  <div> End Time</div>

                  <div className="alllabel">
                    {duration > 3600 && (
                      <div>
                        <input
                          type="number"
                          name="hour"
                          min={0}
                          max={24}
                          placeholder="HH"
                          value={endTime.hour}
                          onChange={changeEndTime}
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
                          placeholder="MM"
                          onChange={changeEndTime}
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
                        placeholder="SS"
                        onChange={changeEndTime}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <button
                  style={{
                    backgroundColor: "#FF00FF",
                  }}
                  className={styles.buttonStyle}
                  onClick={() =>
                    addExercises({
                      id: 4,
                      color: "#FF00FF",
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
                  className={styles.buttonStyle}
                  onClick={() =>
                    addExercises({
                      id: 1,
                      color: "#FF0000",
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
                  className={styles.buttonStyle}
                  onClick={() =>
                    addExercises({
                      id: 2,
                      color: "#309c00",
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
                  className={styles.buttonStyle}
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
                  className={styles.buttonStyle}
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
          <div
            style={{
              marginTop: 100,
              marginLeft: 40,
            }}
          >
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
                    onClick={() => {
                      console.log(data);
                    }}
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
