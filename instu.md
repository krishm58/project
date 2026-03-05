import React, { useEffect, useState, useRef } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const InstrumentForm = () => {

  const [instruments, setinstruments] = useState([]);

  const [procode, setprocode] = useState("")

  const [selectedinstru, setselectedinstru] = useState(null);

  const userdetails = useSelector((state) => state.user.current_user);

  // const [iscalibaration, setiscalibaration] = useState(false) --> Old Calibaration Checkbox
  
  // mode: "" initially => only radios visible, Product Code/Name hidden until Analysis selected
  const [mode, setMode] = useState(""); // "analysis" | "calibration" | "analyst_qualification" | ""


  const [getAllardcol, setgetAllardcol] = useState([])
  const [selectedardcol, setselectedardcol] = useState(null)


  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef(); // Close dropdown on outside mouse click


  useEffect(() => {

    // if (selectedinstru != "") {
      if (selectedinstru) {
      let foundobj = instruments.find((ee) => ee.instr_id == selectedinstru)
      if (foundobj) {
        setselecteddata({ ...selecteddata, "instr_name": foundobj.instr_name, "instr_id": foundobj.instr_id, "proname": "", "strength": "", "btn": "" })
      }
      else {
        setselecteddata({ ...selecteddata, "instr_name": "", "instr_id": "", "proname": "", "strength": "", "btn": "" })
      }
    }
    else {
      setselecteddata({ ...selecteddata, "instr_name": "", "instr_id": "", "proname": "", "strength": "", "btn": "" })
    }

    setselectedardcol(null)

    setprocode("")

    setSearch("")
    setallbatch([])

  }, [selectedinstru])


  const api = useAxiosPrivate();

  const [selecteddata, setselecteddata] = useState({
    "instr_id": "",
    "instr_name": "",
    "proname": "",
    "strength": "",
    "btn": "",
    "remark": "",
    "instr_use": "",
    "started_by": userdetails.user_first_name,
    "is_cleaned": false
  })

  const getAllInstruments = async () => {
    try {

      let response = await api.get("/instrument/get-all-instrument-master");

      if (response.data.status) {
        setinstruments(response.data.data)
      }
      else {
        setinstruments([]);
        toast.info(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const [ardlist, setardlist] = useState([])
  const [selectedardlist, setselectedardlist] = useState("")


  const getDistinctARDEquipmentNames = async () => {
    try {

      let response = await api.get("/instrument/get-ard-distinct-instrument-name");

      if (response.data.status) {
        setardlist(response.data.data)
      }
      else {
        setardlist([]);
        // toast.info(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }


  const getAllARDCols = async () => {
    try {

      let response = await api.get("/instrument/get-ard-cols");

      if (response.data.status) {
        setgetAllardcol(response.data.data)
      }
      else {
        setgetAllardcol([]);
        // toast.info(response.data.message)
      }

    } catch (error) {
      setgetAllardcol([]);
      // toast.error(error.message)
    }
  }

  useEffect(() => {
    getAllInstruments()
    getDistinctARDEquipmentNames()
    getAllARDCols()
  }, [])

  const submitForm = async (e) => {

    e.preventDefault();

    // console.log(selecteddata,"this is selected data")
    // return

    // let dtatosend = { ...selecteddata, iscalibaration, selectedardcol } --> Old Checkbox
    // console.log(dtatosend)
    // return;

    // Old Checkbox
    // if (dtatosend.proname == "" || dtatosend.proname == null) {
    //   toast.info("Please select product code");
    //   return;
    // }

    // ✅ Only ARD must select mode
    if (userdetails.department_name == "ARD" && !mode) {
      toast.info("Please select Analysis / Calibration / Analyst Qualification");
      return;
    }

    let dtatosend = {
      ...selecteddata,
      selectedardcol,
      ...(userdetails.department_name == "ARD" ? { mode } : {})
    };

    if (userdetails.department_name != "ARD" && (selecteddata.proname == "" || selecteddata.proname == null)) {
      toast.info("Please select product code");
      return;
    }

    // console.log(dtatosend)
    // return 

    const response = await api.post("/instrument/add-instrument-usage", dtatosend)

    if (response.data.status) {
      toast.success(response.data.message)
      setselecteddata(
        {
          "instr_id": "",
          "instr_name": "",
          "proname": "",
          "strength": "",
          "btn": "",
          "remark": "",
          "instr_use": "",
          "is_cleaned": false,
          "started_by": userdetails.user_first_name,
        }
      )
      // setiscalibaration(false) --> Old Checkbox
      setMode(""); // reset so only radios visible again
      setselectedardcol(null)
      setprocode("")
      setallbatch([])
      setSearch("")
      setselectedinstru(null)
      setselectedardlist("")
    }
    else {
      toast.info(response.data.message)
    }

  }


  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;


    setselecteddata({ ...selecteddata, [name]: value })

  }


  const [allbatch, setallbatch] = useState([])


  const handlechangeproductcode = async (e) => {
    let value = e.target.value;

    // Remove any non-digit characters and limit to 3 digits
    value = value.replace(/\D/g, '').slice(0, 3);

    if (value.length == 3) {
      let resp = await api.get(`instrument/get-product-master-and-batches/${value}`)

      if (resp.data.status) {
        setallbatch(resp.data.batch);
        setselecteddata({ ...selecteddata, "proname": resp.data.data.proname, "strength": resp.data.data.strength, "btn": "" })
      }
      else {
        setallbatch([])
        setselecteddata({ ...selecteddata, "proname": "", "strength": "", "btn": "" })
        toast.info(resp.data.message)
      }
    }
    else {
      setallbatch([])
      setselecteddata({ ...selecteddata, "proname": "", "strength": "", "btn": "" })
    }

    setprocode(value);
  };


  const handleCheckboxChange = () => {
    setselecteddata({ ...selecteddata, "is_cleaned": !selecteddata.is_cleaned })
  };

  // Old CheckBox Code
  // const handleCalibrationChanges = () => {
  //   if (iscalibaration) {
  //     setselecteddata({ ...selecteddata, "proname": "", "strength": "", "btn": "" })
  //   }
  //   else {
  //     setselecteddata({ ...selecteddata, "proname": "NA", "strength": "", "btn": "" })
  //   }
  //   setiscalibaration(!iscalibaration)
  // }

  const handleModeChange = (newMode) => {
    setMode(newMode);

    // behave like old calibration checked for non-analysis:
    setprocode("");
    setallbatch([]);
    setselecteddata((prev) => ({
      ...prev,
      proname: newMode === "analysis" ? "" : "NA",
      strength: "",
      btn: "",
    }));
  };

  // fix for filtering Sunfire duplicates
  const uniqueColumns = getAllardcol.reduce((acc, current) => {
  if (!acc.find(item => item.columnid === current.columnid)) {
    acc.push(current);
  }
  return acc;
}, []);

 // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 px-4">

      <p className='text-xl md:text-2xl text-center w-full text-white p-3 md:p-3 mb-2 bg-teal-500 rounded-lg shadow-lg shadow-blue-500/40'>Start Equipment</p>
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-xl shadow-md scale-90">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
          Instrument Usage
        </h2>
        <form onSubmit={submitForm} className="space-y-5">
          {/* Name */}
          {
            userdetails.department_name == "ARD" &&
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instrument Name Type
              </label>
              <select
                // name="instrument"
                value={selectedardlist}
                onChange={(e) => {
                  e.preventDefault();
                  setselectedardlist(e.target.value);
                }}
                className="w-full px-4 py-2 border-2 border-cyan-500 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 ease-in-out appearance-none"
              >
                <option value="">Select...</option>
                {
                  ardlist && Array.isArray(ardlist) && ardlist.length > 0 &&
                  ardlist.map((instrument, key) => (
                    <option key={key} value={instrument.instr_name}>
                      {instrument.instr_name}
                    </option>
                  ))
                }
              </select>

            </div>
          }



          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instrument Details
            </label>
            <select
              name="instrument"
              value={selectedinstru}
              onChange={(e) => {
                e.preventDefault();
                setselectedinstru(e.target.value);
              }}
              className="w-full px-4 py-2 border-2 border-cyan-500 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 ease-in-out appearance-none"
              required
            >
              <option value="">Select...</option>
              {
                instruments && Array.isArray(instruments) && instruments.length > 0 &&
                instruments
                  .filter((zz) => selectedardlist ? selectedardlist.trim() == zz.instr_name.trim() : zz)
                  .filter((zz) => zz.instr_status === "Active")
                  .map((instrument) => (
                    <option key={instrument.instr_id} value={instrument.instr_id}>
                      {instrument.instr_id} - {instrument.instr_name}
                    </option>
                  ))
              }
            </select>


          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instrument Name
            </label>
            <input
              type="text"
              value={selecteddata?.instr_name}
              name="instr_name"
              required
              disabled
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
              placeholder="Instrument Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instrument ID
            </label>
            <input
              type="text"
              required
              value={selecteddata?.instr_id}
              name="instr_id"
              disabled
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
              placeholder="Instrument ID"
            />
          </div>

          {
            selecteddata.instr_name && (selecteddata.instr_name.toUpperCase().includes("HPLC") || selecteddata.instr_name.toUpperCase().includes("GAS")) &&
            // <div>

            //   <label className="block text-sm font-medium text-gray-700 mb-1">
            //     Column Name
            //   </label>
            //   <select
            //     // name="instrument"
            //     value={selectedardcol}
            //     onChange={(e) => {
            //       e.preventDefault();
            //       setselectedardcol(e.target.value);
            //     }}
            //     className="w-full px-4 py-2 border-2 border-cyan-500 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 ease-in-out appearance-none"
            //     required
            //   >
            //     <option value="">Select...</option>
            //     {
            //       getAllardcol && Array.isArray(getAllardcol) && getAllardcol.length > 0 &&
            //       getAllardcol
            //       .filter((ele) => {
            //         if (!selecteddata?.instr_name) return true; // no filter if instr_name missing

            //         const instr = selecteddata.instr_name.toUpperCase();

            //         if (instr.includes("HPLC")) {
            //           return ele.columnfor?.toUpperCase().includes("HPLC");
            //         } else if (instr.includes("GAS")) {
            //           return ele.columnfor?.toUpperCase().includes("GAS");
            //         }

            //         return true; // default: no filter
            //       })
            //         .map((ele) => (
            //           <option key={ele.columnid} value={ele.columnid}>
            //             {ele.columnid} - {ele.columndecrpt}
            //           </option>
            //         ))
            //     }
            //   </select>

            // </div>


            <div ref={ref} className="relative w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Column Name *
              </label>

              {/* search input instead of select */}
              <input
                type="text"
                // value={
                //   getAllardcol.find((o) => o.columnid === selectedardcol)?.columndecrpt ||
                //   ""
                // }
                value={
                  selectedardcol
                    ? getAllardcol.find((o) => o.columnid === selectedardcol)?.columndecrpt || ""
                    : search
                }
                onChange={(e) => {
                  setselectedardcol(""); // reset when typing
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                required
                placeholder="Search or select..."
                className="w-full px-4 py-2 border-2 border-cyan-500 rounded-xl bg-transparent text-black focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              {/* dropdown */}
              {showDropdown && (
                <ul className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                  {getAllardcol &&
                    Array.isArray(getAllardcol) &&
                    getAllardcol
                      .filter((ele) => {
                        if (!selecteddata?.instr_name) return true;

                        const instr = selecteddata.instr_name.toUpperCase();

                        if (instr.includes("HPLC")) {
                          return ele.columnfor?.toUpperCase().includes("HPLC");
                        } else if (instr.includes("GAS")) {
                          return ele.columnfor?.toUpperCase().includes("GAS");
                        }
                        return true;
                      })
                      .filter(
                        (ele) =>
                          ele.columnid.toString().toLowerCase().includes(search.toLowerCase()) ||
                          ele.columndecrpt?.toLowerCase().includes(search.toLowerCase())
                      ).length > 0 ? (
                    getAllardcol
                      .filter((ele) => {
                        if (!selecteddata?.instr_name) return true;

                        const instr = selecteddata.instr_name.toUpperCase();

                        if (instr.includes("HPLC")) {
                          return ele.columnfor?.toUpperCase().includes("HPLC");
                        } else if (instr.includes("GAS")) {
                          return ele.columnfor?.toUpperCase().includes("GAS");
                        }
                        return true;
                      })
                      .filter(
                        (ele) =>
                          ele.columnid.toString().toLowerCase().includes(search.toLowerCase()) ||
                          ele.columndecrpt?.toLowerCase().includes(search.toLowerCase())
                      )
                      // .map((ele) => (
                      //   <li
                      //     key={ele.columnid}
                      .map((ele, index) => (
                        <li
                          key={`${ele.columnid}-${index}`} // fixed duplicates 
                          onClick={() => {
                            setselectedardcol(ele.columnid);
                            setSearch(ele.columndecrpt || ele.columnid);
                            setShowDropdown(false);
                          }}
                          className={`px-4 py-2 cursor-pointer hover:bg-cyan-100 ${ele.columnid === selectedardcol ? "bg-cyan-500 text-white" : ""
                            }`}
                        >
                          {ele.columnid} - {ele.columndecrpt}
                        </li>
                      ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">No results found</li>
                  )}
                </ul>
              )}
            </div>

          }
          
          {/* Old Checkbox Code
          <div className='flex gap-4 items-center'>
            {

              !iscalibaration &&
              <>

                <div className='w-1/2'>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Code
                  </label>
                  <input
                    type="text"
                    required
                    value={procode}
                    onChange={handlechangeproductcode}
                    className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
                    placeholder="Product Code"
                  />
                </div>

              </>
            }


            {
              userdetails.department_name == "ARD" &&


              <label className={`inline-flex w-1/2 items-center space-x-2 cursor-pointer ${!iscalibaration ? "mt-6" : "mt-0"}`}>
                <input
                  type="checkbox"
                  checked={iscalibaration}
                  onChange={handleCalibrationChanges}
                  className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="text-gray-800 text-lg">Calibration?</span>
              </label>

            }
          </div> */}

          {userdetails.department_name == "ARD" && (
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Type *
              </label>

              <div className="flex items-center justify-between gap-4">
                <label className="inline-flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="radio"
                    name="mode"
                    value="analysis"
                    checked={mode === "analysis"}
                    onChange={() => handleModeChange("analysis")}
                  />
                  <span className="text-gray-800">Analysis</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="radio"
                    name="mode"
                    value="calibration"
                    checked={mode === "calibration"}
                    onChange={() => handleModeChange("calibration")}
                  />
                  <span className="text-gray-800">Calibration</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="radio"
                    name="mode"
                    value="analyst_qualification"
                    checked={mode === "analyst_qualification"}
                    onChange={() => handleModeChange("analyst_qualification")}
                  />
                  <span className="text-gray-800">Analyst Qualification</span>
                </label>
              </div>
            </div>
          )}

          {(userdetails.department_name != "ARD" || mode === "analysis") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Code
              </label>
              <input
                type="text"
                required
                value={procode}
                onChange={handlechangeproductcode}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
                placeholder="Product Code"
              />
            </div>
          )}

          {/* //Old Checkbox Code
          {
            !iscalibaration &&

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <textarea
                type="text"
                name="proname"
                value={selecteddata.proname + "-" + selecteddata.strength}
                // onChange={handleChange}
                disabled
                required
                className="whitespace-wrap h-auto w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
                placeholder="Product Name"
              />
            </div>

          } */}

        {(userdetails.department_name != "ARD" || mode === "analysis") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <textarea
              type="text"
              name="proname"
              value={selecteddata.proname + "-" + selecteddata.strength}
              disabled
              required
              className="whitespace-wrap h-auto w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
              placeholder="Product Name"
            />
          </div>
        )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {userdetails.department_name == "FRD" || userdetails.department_name == "FRD INJ"
                ? "Batch Number"
                : "Reference Number"}
            </label>
            {
              userdetails.department_name == "FRD" || userdetails.department_name == "FRD INJ"


                ? <select
                  name="btn"
                  value={selecteddata.btn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
                  required
                >
                  <option value="">Select</option>
                  {
                    allbatch && allbatch.length > 0 &&
                    allbatch.map((ele) =>
                      <option value={ele.btn}>{ele.btn}</option>
                    )
                  }
                </select>
                : <input
                  type="text"
                  name="btn"
                  value={selecteddata.btn}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
                  placeholder="Reference Number"
                />
            }





          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <input
              type="text"
              name="remark"
              value={selecteddata.remark}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
              placeholder="Remarks"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instrument Use
            </label>
            <input
              type="text"
              name="instr_use"
              value={selecteddata.instr_use}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
              placeholder="Instrument Use"
            />
          </div> */}

          {
            (userdetails.department_name == "FRD" || userdetails.department_name == "FRD INJ")
            &&

            <div>
              <label className="inline-flex items-center space-x-2">
                {/* <span className="text-gray-700">Is the instrument cleaned?</span> */}
                <input
                  type="checkbox"
                  checked={selecteddata.is_cleaned}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 border-gray-500 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Is the instrument cleaned?</span>
              </label>
            </div>
          }




          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-teal-600 text-white font-medium text-sm tracking-wide rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InstrumentForm


#######################################

const knexConnect = require("../../../knexConnection");
const moment = require("moment");
const knexConnectMSSql = require("../../../knexConnectionMsSQL");

const getAllInstrumentMaster = async (req, res) => {

    let department = req.department_name;

    if (department) {
        if (department == "FRD INJ") {
            department = "FRD"
        }
    }
    else {
        return res.send({
            status: false,
            message: "Department not recieved"
        })
    }

    try {

        let response = await knexConnectMSSql('instrument_master').select("*").where("dep", department);

        return res.send({
            status: true,
            data: response
        })

    } catch (error) {
        console.log(error)
        return res.send({
            status: false,
            message: "Something went wrong"
        })
    }
}


const getAllInstrumentNameMaster = async (req, res) => {

    let department = "ARD";

    try {

        let response = await knexConnectMSSql('instrument_master').select().where("dep", department).distinct("instr_name");

        return res.send({
            status: true,
            data: response
        })

    } catch (error) {
        console.log(error)
        return res.send({
            status: false,
            message: "Something went wrong"
        })
    }
}


const getParticularProductById = async (req, res) => {

    let id = req.params.id;

    try {

        let response = await knexConnectMSSql('productmaster').select("procode", "proname", "strength", "market", "client", "dep").where("procode", id);

        if (response && Array.isArray(response) && response.length > 0) {

            let batchresult = await knexConnectMSSql("batchmaster")
                .select("jobid", "btorigin", "procode", "proname", "strength", "market", "btn", "btsize")
                .where(function () {
                    this.where("btstatus", "LNB Sign Off")
                        .orWhere("btstatus", "Reconciliation Completed")
                        .orWhere("btstatus", "Manufacturing Completed")
                        .orWhere("btstatus", "Equipment Entry Done")
                        .orWhere("btstatus", "Batch Entry Approved");
                })
                .andWhere("procode", id);


            return res.send({
                status: true,
                data: response[0],
                batch: batchresult
            })

        }
        else {
            return res.send({
                status: false,
                data: null,
                message: "No such product code found"
            })

        }

    } catch (error) {
        return res.send({
            status: false,
            message: "Something went wrong"
        })
    }
}


// const getAllUsage = async (req, res) => {

//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.pagesize) || 10;

//     const offset = (page - 1) * pageSize;

//     let department = req.department_name;

//     try {

//         // let response = await knexConnectMSSql('instrument_usage').select("*");

//         const totalDataCountResult = await knexConnectMSSql('instrument_usage as iu')
//             .join('instrument_master as eq', 'iu.instr_id', 'eq.instr_id')
//             .where('eq.dep', department)
//             .count('* as count');
//         const totalDataCount = totalDataCountResult[0].count;

//         const data = await knexConnectMSSql('instrument_usage as iu')
//             .join('instrument_master as eq', 'iu.instr_id', 'eq.instr_id')
//             .select([
//                 'iu.*',
//                 knexConnectMSSql.raw("DATEADD(MINUTE, -330, iu.starttime) as starttimenew"),
//                 knexConnectMSSql.raw("DATEADD(MINUTE, -330, iu.endtime) as endtimenew"),
//                 // Optionally include department name or other equipment details
//                 'eq.dep'
//             ])
//             .where('eq.dep', department)
//             .offset(offset)
//             .limit(pageSize)
//             .orderBy('iu.id', 'desc');

//         // Calculate metadata
//         const totalPages = Math.ceil(totalDataCount / pageSize);

//         return res.send({
//             status: true,
//             data: data,
//             pagination: {
//                 current_page: page,
//                 total_pages: totalPages,
//                 total_data_count: totalDataCount,
//                 current_data_count: data.length,
//                 page_size: pageSize
//             }
//         })

//     } catch (error) {
//         console.log(error)
//         return res.send({
//             status: false,
//             message: "Something went wrong"
//         })
//     }
// }


const getAllUsage = async (req, res) => {
    const {
        page = 1,
        pageSize = 10,
        sort = '',
        departmentfilter,
        ...filters // all other query parameters
    } = req.query;

    const offset = (page - 1) * pageSize;
    let department = req.department_name;

    if (department) {
        if (department == "FRD INJ") {
            department = "FRD"
        }

        if (department == "DQA") {
            department = departmentfilter || "FRD";
        }
    }

    else {
        return res.send({
            status: false,
            message: "Department not recieved"
        })
    }


    try {

        const columnTableMap = {
            instr_id: 'eq',
            instr_name: 'iu',
            proname: 'iu',
            btn: 'iu',
            remark: 'iu',
            startedby: 'iu',
            starttime: 'iu',
            endtime: 'iu',
            endremark: 'iu',
            endedby: 'iu',
            cleancheckby: 'iu',
            cleaningcheckon: 'iu',
            dep: 'eq',
            endremark: 'iu',
            usetype: 'iu'
            // Add more known columns here as needed
        };


        // Base query with join and department filter
        let baseQuery = knexConnectMSSql('instrument_usage as iu')
            .join('instrument_master as eq', 'iu.instr_id', 'eq.instr_id')


        if (department == "FRD" || department == "FRD INJ" || department == "ARD") {
            baseQuery = baseQuery.where('eq.dep', department);
        }

        // Apply dynamic filters
        // for (const [key, value] of Object.entries(filters)) {
        //     if (value) {
        //         baseQuery = baseQuery.where(`iu.${key}`, 'like', `%${value}%`);
        //     }
        // }

        for (const [key, value] of Object.entries(filters)) {
            if (value) {
                const tableAlias = columnTableMap[key];
                if (tableAlias) {
                    baseQuery = baseQuery.where(`${tableAlias}.${key}`, 'like', `%${value}%`);
                } else {
                    console.warn(`Skipping unknown filter column: ${key}`);
                }
            }
        }

        // Clone to get total count before applying pagination
        const totalDataCountResult = await baseQuery.clone().count('* as count');
        const totalDataCount = totalDataCountResult[0].count;

        // Apply sorting
        if (sort) {
            const sortFields = sort.split(';');
            sortFields.forEach(field => {
                const [column, direction] = field.split(',');
                if (column && ['asc', 'desc'].includes(direction?.toLowerCase())) {
                    baseQuery = baseQuery.orderBy(`iu.${column}`, direction);
                }
            });
        } else {
            baseQuery = baseQuery.orderBy('iu.id', 'desc'); // Default sort
        }

        // Fetch data with timezone conversion
        const data = await baseQuery
            .select([
                'iu.*',
                knexConnectMSSql.raw("DATEADD(MINUTE, -330, iu.starttime) as starttimenew"),
                knexConnectMSSql.raw("DATEADD(MINUTE, -330, iu.endtime) as endtimenew"),
                'eq.dep'
            ])
            .offset(offset)
            .limit(pageSize);

        const totalPages = Math.ceil(totalDataCount / pageSize);

        return res.send({
            status: true,
            data,
            pagination: {
                current_page: Number(page),
                total_pages: totalPages,
                total_data_count: totalDataCount,
                current_data_count: data.length,
                page_size: Number(pageSize)
            }
        });

    } catch (error) {
        console.error(error);
        return res.send({
            status: false,
            message: "Something went wrong"
        });
    }
};



const addInstrumentUsage = async (req, res) => {

    let {
        instr_id,
        instr_name,
        proname,
        btn,
        remark,
        started_by,
        is_cleaned,
        selectedardcol,
        // cleancheckby,
        // cleancheckon,
        instr_use,
        iscalibaration
    } = req.body;

    let department = req.department_name;

    if (department) {
        if (department == "FRD INJ") {
            department = "FRD"
        }
    }
    else {
        return res.send({
            status: false,
            message: "Department not recieved"
        })
    }

    let usetype = null;


    if (department == "ARD") {
        if (iscalibaration) {
            usetype = "Calibration";
            proname = "NA"
        }
        else {
            usetype = "Analysis"
        }
    }

    /* 
    let usetype = null;
    
    if (department === "ARD") {
    
    if (mode === "analysis") {
        usetype = "Analysis";
    } 
    
    else if (mode === "calibration") {
        usetype = "Calibration";
    } 
    
    else if (mode === "analyst_qualification") {
        usetype = "Analyst Qualification";
    }
}
*/

    let formattedDate = moment().format('YYYY-MM-DD HH:mm:ss');


    try {

        const activeUsage = await knexConnectMSSql('instrument_usage')
            .where({ "instr_id": instr_id })
            .whereNull('endtime')
            .whereNotNull('starttime')
            .first();

        if (activeUsage) {
            return res.send({
                status: false,
                message: `Instrument is currently in use by ${activeUsage.startedby} since ${moment(activeUsage.starttime).subtract(5, 'hours').subtract(30, 'minutes').format('DD-MM-YYYY HH:mm:ss A')}.`
            });
        }

        const now = moment();

        if (department != "ARD") {


            const lastClean = await knexConnectMSSql('instrument_usage')
                .where({ "instr_id": instr_id })
                .whereNotNull('cleaningcheckon')
                .orderBy('cleaningcheckon', 'desc')
                .first();



            console.log(lastClean, "lastClean")

            let isCleanOk = true;

            if (!lastClean) {
                if (!is_cleaned) {
                    return res.send({ status: false, message: 'Please clean the machine before first use.' });
                }
            }

            console.log(isCleanOk)

            if (lastClean && lastClean.cleaningcheckon) {
                const lastCleanTime = moment(lastClean.cleaningcheckon);
                const hoursDiff = now.diff(lastCleanTime, 'hours');

                console.log(hoursDiff, "hoursDiff")
                console.log(is_cleaned, "is_cleaned")

                if (hoursDiff > 48 && !is_cleaned) {
                    isCleanOk = false;
                }
            }

            console.log(isCleanOk, "isCleanOk")

            if (!isCleanOk) {
                return res.send({ status: false, message: 'Please clean the machine before using it.' });
            }
        }


        let response = await knexConnectMSSql('instrument_usage').insert({
            "instr_name": instr_name,
            "instr_id": instr_id,
            proname,
            btn,
            remark,
            "startedby": started_by,
            "starttime": formattedDate,
            "cleancheckby": is_cleaned ? started_by : null,
            // cleancheckon,
            instr_use,
            cleaningcheckon: is_cleaned ? now.format('YYYY-MM-DD HH:mm:ss') : null,
            "usetype": usetype,
            "columnid": selectedardcol
        });

        return res.send({
            status: true,
            message: "Instrument Usage Added Successfully"
        })


    } catch (error) {
        console.log(error)
        return res.send({
            status: false,
            message: "Something went wrong"
        })
    }
}


const markDoneUsage = async (req, res) => {
    let { id, ended_by, remarks,injection } = req.body;

    let formattedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    try {

        let getentry = await knexConnectMSSql("instrument_usage").select("*").where("id", id);

        if (!(getentry && Array.isArray(getentry) && getentry.length > 0)) {
            return res.send({
                status: false,
                message: "No entry found please refresh page"
            })
        }

        let instr_id = getentry[0].instr_id;
        let started_by = getentry[0].startedby;

        let getinstrument = await knexConnectMSSql("instrument_master").select("*").where("instr_id", instr_id);

        if (!(getinstrument && Array.isArray(getinstrument) && getinstrument.length > 0)) {
            return res.send({
                status: false,
                message: "Particular instrument not found."
            })
        }

        if (getinstrument[0].other_stop == "No") {
            if (!(ended_by === started_by)) {
                return res.send({
                    status: false,
                    message: `Only ${started_by} can stop the machine`
                })
            }
        }

        let response = await knexConnectMSSql('instrument_usage')
            .where({ "id": id })
            .update({
                "endtime": formattedDate,
                "endedby": ended_by,
                "endremark": remarks,
                "injectioncount": injection
            });

        return res.send({
            status: true,
            message: "Instrument Usage Marked Done Successfully"
        })
    }
    catch {
        return res.send({
            status: false,
            message: "Something went wrong"
        })
    }
}

const getRunningInstruments = async (req, res) => {

    let department = req.department_name;

    let departmentfilter = req.query.departmentfilter;

    if (department) {
        if (department == "FRD INJ") {
            department = "FRD"
        }

        if (department == "DQA") {
            department = departmentfilter || "FRD";
        }
    }
    else {
        return res.send({
            status: false,
            message: "Department not recieved"
        })
    }

    try {

        const runningInstruments = await knexConnectMSSql('instrument_usage as usage')
            .whereNull('usage.endtime')
            .whereNotNull('usage.starttime')
            .join('instrument_master as master', 'usage.instr_id', 'master.instr_id')
            // .leftJoin('productmaster as pm', 'pm.proname', 'usage.proname')
            .andWhere('master.dep', department)
            .select(
                'usage.id',
                'usage.instr_id',
                'usage.instr_name',
                'usage.startedby',
                knexConnectMSSql.raw("DATEADD(MINUTE, -330, usage.starttime) as starttime"),
                // 'pm.procode',
                'usage.proname',
                'usage.btn',
                'usage.remark',
                'master.image_link',
                'master.dep',
                'usage.usetype',
                'usage.columnid'
            )
            // .distinct('usage.id')
            .orderBy('usage.starttime', 'desc');


        if (runningInstruments.length === 0) {
            return res.send({
                status: false,
                message: 'No instruments are currently in use.',
                data: []
            });
        }

        return res.send({
            status: true,
            message: 'Running instruments fetched successfully.',
            data: runningInstruments
        });

    } catch (error) {
        console.error(error.message);
        return res.send({
            status: false,
            message: 'Something went wrong while fetching running instruments.'
        });
    }
};


const getARDCols = async (req, res) => {
    try {

        let data = await knexConnectMSSql("ard_column").select("columnid", "columndecrpt","columnfor");

        return res.send({
            status: true,
            data
        })

    } catch (error) {
        console.log(error)
        return res.send({
            status: false,
            message: "Something went wrong"
        })
    }
}


module.exports = { getARDCols, getAllInstrumentNameMaster, getParticularProductById, getRunningInstruments, getAllInstrumentMaster, markDoneUsage, addInstrumentUsage, getAllUsage }
