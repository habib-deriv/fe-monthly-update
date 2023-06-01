import React, { useState, useEffect, useRef } from "react";
import "material-icons/iconfont/material-icons.css";
import Tick from "@/assets/tick.png";
import RebrandingIcon from "@/assets/vector.png";
import { useSelector } from "react-redux";
import domtoimage from "dom-to-image";
import FileSaver from "file-saver";
// import  Chart  from '@/components/charts';
import { COLLECTIONS } from "@/constants";
import { Skeleton, Star, MonthSelector, EmptyList } from "@/components";
import { useFetch } from "@/hooks";
import { Button, Chip } from "@mui/material";
// import { fetchStats, setIsStatsLoading, TData } from '@/stores/charts';
import { TRootState } from "@/stores/store";
// import { setIsDateChanged} from '@/stores/settings';
import { capitalize, sendMonthlyUpdate, has_items_in_month } from "@/utils";
import "./App.scss";
import New from "@/assets/new.png";
import Old from "@/assets/old.png";


const App = () => {
  // const dispatch = useDispatch<TAppDispatch>();
  const { settings } = useSelector((state: TRootState) => state);
  const [is_loading_stars, stars, grouped_stars] = useFetch(
    COLLECTIONS.STARS,
    "month",
    settings.list.months
  );
  const [is_loading_leaders, leaders, grouped_leaders] = useFetch(
    COLLECTIONS.LEADERS,
    "month",
    settings.list.months
  );
  const [is_loading_tasks, tasks, grouped_tasks] = useFetch(
    COLLECTIONS.TASK,
    "week",
    settings.list.weeks
  );
  const [is_loading_summary, summary] = useFetch(COLLECTIONS.SUMMARY);
  const [is_road_empty, setIsRoadEmpty] = useState(false);
  const [is_loading_road, road] = useFetch(COLLECTIONS.ROADMAP);
  const [is_loading_app, app] = useFetch(COLLECTIONS.ROADMAP_DERIV_APP);
  const [is_loading_com, com] = useFetch(COLLECTIONS.ROADMAP_DERIV_COM);
  const [is_loading_bots, bots] = useFetch(COLLECTIONS.ROADMAP_BOTS);
  const [is_loading_cashier, cashier] = useFetch(COLLECTIONS.ROADMAP_CASHIER);
  // const [filtered_repositories, setFilteredRepositories] = useState<[string, TData][]>(Object.keys(charts.stats).length > 0 ? [Object.entries(charts.stats)[0]] : []);
  // const [current_repo_name, setCurrentRepoName] = useState('');
  const exportRef = useRef();

  // const filterRepositories = useCallback((repository: string) => {
  //     if(repository === 'All') {
  //         const all_stats = Object.values(charts.stats).reduce((acc,el)=>{
  //             return ({
  //                 additions      : acc.additions! + el.additions!,
  //                 deletions      : acc.deletions! + el.deletions!,
  //                 merged_prs     : acc.merged_prs! + el.merged_prs!,
  //                 number_of_files: acc.number_of_files! + el.number_of_files!,
  //                 opened_prs     : acc.opened_prs! + el.opened_prs!,
  //                 prs            : acc.prs!.concat(el.prs!),
  //             });
  //         });
  //         setFilteredRepositories([['All', all_stats]]);
  //     } else {
  //         const filtered_repos = Object.entries(charts.stats).filter(([repo, _])=> repo === repository);
  //         setFilteredRepositories(filtered_repos);
  //     }
  //     setCurrentRepoName(repository);
  // }, [charts.stats]);

  // useEffect(()=>{
  //     if(Object.keys(charts.stats).length === 0 || settings.is_date_changed){
  //         dispatch(setIsStatsLoading(true));
  //         dispatch(fetchStats());
  //         dispatch(setIsDateChanged(false));
  //     }
  // },[dispatch, settings.date, settings.is_date_changed, charts.stats]);

  // useEffect(()=>{
  //     filterRepositories(REPOSITORIES[0]);
  // },[charts.stats, filterRepositories]);

  useEffect(() => {
    if (!road.length) setIsRoadEmpty(true);
    else setIsRoadEmpty(false);
  }, [road]);

  useEffect(() => {
    console.log(grouped_stars);
  }, [grouped_stars]);

  const taskList = (list: any, type: string) =>
    list.filter(
      (item: any) => item.type === type && item.month === settings.date.month
    );

  const exportImage = async (el: any, imageFileName: string) => {
    domtoimage.toBlob(el).then(function (blob) {
      FileSaver.saveAs(blob, imageFileName);
    });
  };

  const mdWrapper = (str: string) => {
    return (
      <div
        style={{
          display: "inline-block",
          fontSize: 13,
          fontFamily: "monospace",
          background: "rgb(0,0,0,0.08)",
          borderRadius: 4,
          boxSizing: "border-box",
          padding: "0px 6px 0px",
        }}
      >
        {str}
      </div>
    );
  };

  const toMdTest = (str: string) => {
    const fragments = str.split("`");
    const rendered_fragments = fragments.map((el, index) => {
      if (index % 2 === 0) {
        return el;
      } else {
        return mdWrapper(el);
      }
    });
    return (
      <>
        {rendered_fragments.map((el) => (
          <>{el} </>
        ))}
      </>
    );
  };

  return (
    <div className="app-hero px-0">
      <React.Fragment>
        <div className="flex items-center justify-between mb-2 px-1 d-none">
          <div className="flex items-center justify-start basis-1/3">
            <h3 className="text-2xl font-bold mr-2 color-white">Overview</h3>
            <Chip
              label={capitalize(settings.date.month)}
              size="small"
              variant="outlined"
              color="warning"
            />
          </div>
          <div className="flex items-center justify-end">
            <MonthSelector />
            <Button
              variant="contained"
              disableElevation
              color="secondary"
              size="small"
              className="ml-2"
              onClick={() => exportImage(exportRef.current, "preview")}
            >
              Export Image
            </Button>
            <Button
              variant="contained"
              disableElevation
              color="secondary"
              size="small"
              className="ml-2"
              onClick={() => {
                sendMonthlyUpdate(grouped_stars, grouped_tasks, road, settings);
              }}
            >
              Export Video
            </Button>
          </div>
        </div>

        <div
          // @ts-ignore
          ref={exportRef}
          className="bg-white"
        >
          {/* Empty List */}
          {!is_loading_tasks &&
            !has_items_in_month(tasks, settings.date.month) &&
            !has_items_in_month(stars, settings.date.month) &&
            is_road_empty /* && !filtered_repositories.length */ && (
              <EmptyList title="This month is Empty" has_description={false} />
            )}

          <div className="flex background-img justify-start p-4 banner-content">
            <span className="block main-header font-bold text-white p-4 rightous-font">
              Web Platform Monthly Updates May 2023
            </span>
          </div>

          {/* Summary */}
          {is_loading_summary && <Skeleton row={1} />}
          {!is_loading_summary && (
            <div className="mt-ng20">
              <span className="block text-2xl font-medium text-black text-center tracking-widest p-4 my-4">
                Web Platform monthly report
              </span>
              {summary &&
                summary.map((item) => {
                  return (
                    <div className="block summary width90">
                      <span className="block text-justify font-3 text-lt">
                      Hello fellow Derivians,
<br />
We are excited to share the remarkable accomplishments of the <b>Web Platform team</b> over the past month. Our relentless dedication to creating performant and top-quality web applications, along with maintaining the supporting platform, has yielded impressive results in Core Web Vitals.
<br />

Firstly, we are thrilled to announce the successful rebranding of the Deriv.com homepage. With Live Markets Pricing, users can now access real-time information, enhancing their trading experience. We are diligently working on revamping other pages, ensuring a seamless user interface across the platform. Additionally, Binary.com has been redirected to Deriv.com, simplifying user access.
<br />

Our latest Deriv API version showcases outstanding progress. With a test coverage of approximately 95%, we have ensured the reliability and robustness of our API, enabling developers to interact smoothly.
<br />

Moreover, we proudly unveil the user-friendly new UI for the Deriv Bot homepage. This update empowers users to navigate and utilize the Deriv Bot platform effortlessly.
<br />

In our commitment to staying at the forefront of web development, we are actively preparing a major update. Adoption of Gatsby 5 and React 18 will bring exciting features and performance optimizations to our web applications.
<br />

Despite challenges, we remain dedicated to overcoming obstacles and delivering exceptional results. Your feedback is invaluable. Please share your opinions and suggestions with us.
<br />

Thank you for your continued support as we strive to provide the best web experience.
<br />

Best regards, <br />
The Web Platform Team
                      </span>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Datadog */}
          <div className="">
            <span className="block text-2xl font-medium text-black text-center tracking-widest p-4 my-4">
              Deriv.com numbers from Datadog RUM
            </span>

            <div className="width90">
              <b>Largest Contentful Paint (LCP) </b>is an important, stable Core Web Vital metric for measuring perceived load speed because it marks the point in the page load timeline when the page's main content has likely loaded—a fast LCP helps reassure the user that the page is useful.
              <br />
              <br />
              
              The below graphs are our newly measured LCP after our rebranding release of Deriv.com and the LCP before the release week. Where it's measured as our current average as <b>2.83s</b> and it was <b>3.31s</b> before for LCP.
              <br />

              <img
                className="performance-update"
                src={New}
                alt="performance update"
              />
              <br />
            </div>
            <div className="width90 text-center">
              <br />
              <img
                className="performance-update"
                src={Old}
                alt="performance update"
              />
              <br />
            </div>
          </div>

          {/* Tasks */}
          {is_loading_tasks && <Skeleton row={2} />}
          {!is_loading_tasks &&
            has_items_in_month(tasks, settings.date.month) &&
            grouped_tasks && (
              <div>
                <span className="block text-2xl font-medium text-black text-center tracking-widest p-4 my-4">
                  What we did last month
                </span>

                <div className="width90">
                  {Object.keys(grouped_tasks).map((key) => {
                    return (
                      <div
                        className="block bg-gradient-to-t from-slate-200 to-slate-100 drop-shadow-lg rounded-md p-4 mb-8 bg-red-sh"
                        key={key}
                      >
                        <span className="block text-lg font-medium text-black text-center tracking-wide mb-4">
                          Week {key}
                        </span>

                        <div className="grid gap-4 grid-cols-2">
                          <div className="border-2 rounded-md bg-white border-white">
                            <div className="p-2 bg-white text-green-600">
                              <span className="block text-xl text-center font-medium text-lg">
                                Accomplishments
                              </span>
                            </div>
                            <div className="p-4">
                              {taskList(grouped_tasks[key], "achievement").map(
                                (item: any, idx: number) => {
                                  return (
                                    <div key={idx} className="mb-3">
                                      <p className="text-base font-medium mb-4">
                                        {item.title}
                                      </p>
                                      <ul className="list-disc ml-4">
                                        {item.description
                                          .split("|")
                                          .map((item: string, idx: number) => {
                                            return (
                                              <div className="flex gap-3 items-center pb-2">
                                                {/*<span className="material-icons text-green-600">check</span>*/}
                                                <img
                                                  src={Tick}
                                                  alt="dRebranding"
                                                  width="19"
                                                />
                                                <li
                                                  key={idx}
                                                  className="text-md list-none"
                                                >
                                                  {toMdTest(item.trim())}
                                                </li>
                                              </div>
                                            );
                                          })}
                                      </ul>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          <div className="border-2 rounded-md bg-white border-white">
                            <div className="p-2 bg-white border-white text-red-600">
                              <span className="block text-xl text-center font-medium text-lg">
                                Challenges
                              </span>
                            </div>
                            <div className="p-4">
                              {taskList(grouped_tasks[key], "challenge").map(
                                (item: any, idx: number) => {
                                  return (
                                    <div key={idx} className="mb-3">
                                      <p className="text-base font-medium mb-4">
                                        {item.title}
                                      </p>
                                      <ul className="list-disc ml-4">
                                        {item.description
                                          .split("|")
                                          .map((item: string, idx: number) => {
                                            return (
                                              <div className="flex gap-3 items-center pb-2">
                                                <span className="material-icons text-red-600 w-6">
                                                  computer_rounded
                                                </span>
                                                <li
                                                  key={idx}
                                                  className="text-md list-none"
                                                >
                                                  {toMdTest(item.trim())}
                                                </li>
                                              </div>
                                            );
                                          })}
                                      </ul>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Stars */}
          {is_loading_stars && <Skeleton row={2} />}
          {!is_loading_stars &&
            has_items_in_month(stars, settings.date.month) && (
              <>
                <span className="block text-2xl font-medium text-black text-center tracking-widest p-4 mt-5">
                  Stars of the month
                </span>
                <div className="card-section">
                  <div className="flex flex-wrap justify-center star-container">
                    {grouped_stars[settings.date.month]
                        .map((star, idx) => ({ idx, star }))
                        // @ts-ignore
                        .sort((a, b) => a.star.id - b.star.id)
                        .map(({ idx, star }) => <Star key={idx} item={star} />)}
                  </div>
                </div>
              </>
            )}
          {/* Leaders */}
          {is_loading_leaders && <Skeleton row={2} />}
          {!is_loading_leaders &&
            has_items_in_month(leaders, settings.date.month) && (
              <>
                <span className="block text-2xl font-medium text-black text-center tracking-widest p-4 mt-5">
                  Leader of the month
                </span>
                <div className="card-section">
                  <div className="flex flex-wrap justify-center star-container">
                    {grouped_leaders[settings.date.month].map((leader, idx) => {
                      return <Star key={idx} item={leader} />;
                    })}
                  </div>
                </div>
              </>
            )}
          {/* Road */}
          {is_loading_road && <Skeleton row={2} />}
          {!is_loading_road && !is_road_empty && (
            <div className="road-ahead-container">
              <div className="block text-2xl font-medium text-black text-center tracking-widest p-4 mt-5 mb-5">
                What's next?
              </div>
              <table className="width1000 text-sm">
                <tr className="table-row-header">
                  <tr>
                    <th className="table-head text-white text-center">
                      Deriv.com
                    </th>
                    <td className="table-data">
                      <ul className="list-disc">
                        {com.map((item) => {
                          return <li className="p-1">{item.title}</li>;
                        })}
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <th className="table-head text-white text-center">
                      Trading Apps
                    </th>
                    <td className="table-data">
                      <ul className="list-disc">
                        {app.map((item) => {
                          return <li className="p-1">{item.title}</li>;
                        })}
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <th className="table-head text-white text-center">
                      DP2P & DTrader & Bots
                    </th>
                    <td className="table-data">
                      <ul className="list-disc">
                        {bots.map((item) => {
                          return <li className="p-1">{item.title}</li>;
                        })}
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <th className="table-head text-white text-center">
                      Wallets/Cashier
                    </th>
                    <td className="table-data">
                      <ul className="list-disc">
                        {cashier.map((item) => {
                          return <li className="p-1">{item.title}</li>;
                        })}
                      </ul>
                    </td>
                  </tr>
                </tr>
              </table>
            </div>
          )}
        </div>
      </React.Fragment>
    </div>
  );
};

export default App;
