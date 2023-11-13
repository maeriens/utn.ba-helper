if (!window.UtnBaHelper) window.UtnBaHelper = {};
UtnBaHelper.ApiConnector = function () {

	const CLIENT = `CHROME@${chrome.runtime.getManifest().version}`;
	const BASE_API_URL = "https://www.pablomatiasgomez.com.ar/utnba-helper/v2";

	let logMessage = function (method, isError, message) {
		return postData(BASE_API_URL + "/log", {
			method: method,
			error: isError,
			message: message
		});
	};

	let logUserStat = function (hashedStudentId, pesoAcademico, passingGradesAverage, allGradesAverage, passingGradesCount, failingGradesCount) {
		return postData(BASE_API_URL + "/user-stats", {
			hashedStudentId: hashedStudentId,
			pesoAcademico: pesoAcademico,
			passingGradesAverage: passingGradesAverage,
			allGradesAverage: allGradesAverage,
			passingGradesCount: passingGradesCount,
			failingGradesCount: failingGradesCount
		});
	};

	let postClassSchedules = function (classSchedules) {
		return postData(BASE_API_URL + "/class-schedules", classSchedules);
	};

	let postProfessorSurveys = function (surveys) {
		return postData(BASE_API_URL + "/professor-surveys", surveys);
	};

	let postCourses = function (courses) {
		return postData(BASE_API_URL + "/courses", courses);
	}

	let postData = function (url, data) {
		return makeRequest({
			url: url,
			method: 'POST',
			headers: {
				"X-Client": CLIENT,
				"Content-type": "application/json; charset=utf-8"
			},
			body: JSON.stringify(data)
		});
	};

	// ------

	let getPreviousProfessors = function (previousProfessorsRequest) {
		return postData(BASE_API_URL + "/previous-professors", previousProfessorsRequest);
	};

	let searchProfessors = function (query) {
		return getData(BASE_API_URL + "/professors?q=" + encodeURIComponent(query));
	};

	let getProfessorSurveysAggregate = function (professorName) {
		return getData(BASE_API_URL + "/aggregated-professor-surveys?professorName=" + encodeURIComponent(professorName));
	};

	let getClassesForProfessor = function (professorName, offset, limit) {
		return getClassesSchedules(null, professorName, offset, limit);
	};

	let searchCourses = function (query) {
		return getData(BASE_API_URL + "/courses?q=" + encodeURIComponent(query));
	};

	let getPlanCourses = function (planCode) {
		return getData(BASE_API_URL + "/courses?planCode=" + encodeURIComponent(planCode));
	};

	let getClassesForCourse = function (courseCode, offset, limit) {
		return getClassesSchedules(courseCode, null, offset, limit);
	};

	let getClassesSchedules = function (courseCode, professorName, offset, limit) {
		let params = {
			offset: offset,
			limit: limit
		};
		if (courseCode) params.courseCode = courseCode;
		if (professorName) params.professorName = professorName;
		return getData(BASE_API_URL + "/class-schedules?" + buildQueryParams(params));
	};

	let getData = function (url) {
		return makeRequest({
			url: url,
			method: 'GET',
			headers: {
				"X-Client": CLIENT
			}
		});
	};

	// ---

	let makeRequest = function (options) {
		// TODO this is duplicated in Utils.backgroundFetch.
		return new Promise((resolve, reject) => {
			chrome.runtime.sendMessage(options, response => (response && response.errorStr) ? reject(new Error(response.errorStr)) : resolve(response));
		});
	};

	let buildQueryParams = function (params) {
		return Object.entries(params)
			.map(entry => `${encodeURIComponent(entry[0])}=${encodeURIComponent(entry[1])}`)
			.join("&");
	};


	// Public
	return {
		// POSTs:
		logMessage: logMessage,
		logUserStat: logUserStat,
		postClassSchedules: postClassSchedules,
		postProfessorSurveys: postProfessorSurveys,
		postCourses: postCourses,

		// GETs:
		getPreviousProfessors: getPreviousProfessors,
		searchProfessors: searchProfessors,
		getProfessorSurveysAggregate: getProfessorSurveysAggregate,
		getClassesForProfessor: getClassesForProfessor,
		searchCourses: searchCourses,
		getPlanCourses: getPlanCourses,
		getClassesForCourse: getClassesForCourse,
	};
};
