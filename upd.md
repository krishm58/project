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
        mode // <-- Changed from iscalibaration to mode
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

    // <-- Updated logic to handle the three radio options
    if (department == "ARD") {
        if (mode === "calibration") {
            usetype = "Calibration";
            proname = "NA"; // Fallback to ensure "NA" is recorded
        } 
        else if (mode === "analyst_qualification") {
            usetype = "Analyst Qualification";
            proname = "NA"; // Fallback to ensure "NA" is recorded
        }
        else if (mode === "analysis") {
            usetype = "Analysis";
        }
    }

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

            let isCleanOk = true;

            if (!lastClean) {
                if (!is_cleaned) {
                    return res.send({ status: false, message: 'Please clean the machine before first use.' });
                }
            }

            if (lastClean && lastClean.cleaningcheckon) {
                const lastCleanTime = moment(lastClean.cleaningcheckon);
                const hoursDiff = now.diff(lastCleanTime, 'hours');

                if (hoursDiff > 48 && !is_cleaned) {
                    isCleanOk = false;
                }
            }

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
