import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fa from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import consts from '../../consts.js'
import Modal from '../../components/utilities/modals/Modal.jsx'
import Spinner from '../../components/utilities/loading/Spinner'

function ChallengeForm() {

    const [challenge, setChallenge] = useState({
        id: undefined,
        category: {
            id: null
        },
        title: null,
        brief: null,
        description: null,
        icon: null,
        checkpoints: []
    })
    const [categories, setCategories] = useState([])

    const [iconSearch, setIconSearch] = useState("")
    const [iconMaxValues, setIconMaxValues] = useState(60)

    const [showCategoryModal, setShowCategoryModal] = useState(false)
    const [showQuestionsModal, setShowQuestionsModal] = useState(false)

    const [loadingCategoryChanges, setLoadingCategoryChanges] = useState(false)

    const accentColors = [
        "#916932",
        "#D48E29",
        "#EC5A46",
        "#E15263",
        "#DF5193",
        "#D59AC5",
        "#8D55A2",
        "#18A2C6",
        "#0288AD",
        "#2B9446",
        "#83C341"
    ]

    const questionLevel = {
        EASY: "Easy",
        MEDIUM: "Medium",
        HARD: "Hard"
    }

    const questionType = {
        PRACTICAL: "Practical",
        THEORICAL: "Theorical"
    }

    const initialCategory = {
        id: null,
        title: null,
        accentColor: accentColors[0],
    }

    const initialQuestion = {
        id: null,
        title: null,
        level: null,
        type: null,
        answerType: null,
        answers: []
    }

    const [editCategory, setEditCategory] = useState(initialCategory)
    const [editQuestion, setEditQuestion] = useState(initialCategory)

    const [newQuestionOption, setNewQuestionOption] = useState("")

    function searchMatch(search, array) {
        const matches = array.filter(key => {
            var regexp = new RegExp(search, "gi")
            return key.match(regexp)
        })

        let maxValues
        if (matches.length > iconMaxValues) { maxValues = iconMaxValues } else { maxValues = matches.length }
        let arrayValues = matches.slice(0, maxValues)
        return arrayValues
    }

    const closeCategoryModal = () => {
        setShowCategoryModal(false)
        setEditCategory(initialCategory)
    }

    const closeQuestionsModal = () => {
        setShowQuestionsModal(false)
    }

    useEffect(() => {
        axios.get(`${consts.LOCAL_API}/challenges/categories?min=true`)
            .then(res => {
                setCategories(res.data || [])
            })
            .catch(err => {
                console.error(err)
            })
    }, [])

    return (
        <div className="content">
            <div className="form-container">
                <form className="form-container" onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    let type = "post"

                    let challengeData = { ...challenge }

                    if (challenge.icon === null) {

                    } else {
                        if (challenge.id)
                            type = "put"

                        axios[type](`${consts.LOCAL_API}/challenges`, challengeData)
                            .then((response) => {
                                setChallenge(response.data || {})
                            })
                            .catch(() => {

                            })
                            .then(() => {

                            })
                    }
                }}>
                    <div>
                        <div className="form-title">
                            {challenge.id ? "Edit Challenge" : "New Challenge"}
                        </div>
                        <div className="input-section">
                            <div className="row">
                                <div className='input-group-50'>
                                    <label>Title</label>
                                    <input type="text" className='input-field' required
                                        onChange={(e) => {
                                            setChallenge({ ...challenge, title: e.target.value })
                                        }} value={challenge?.title || ""}
                                    />
                                </div>
                                <div className='input-group-50'>
                                    <label>Category</label>
                                    <div className="row w-100 gap-15 vertical-center">
                                        <select className='input-field' required
                                            onChange={(e) => {
                                                setChallenge({ ...challenge, category: categories.find(c => c.id === e.target.value) })
                                            }} value={challenge.category?.id || ""}
                                        >
                                            <option value="">Select...</option>
                                            {categories.map(category => (
                                                <option value={category.id}>{category.name}</option>
                                            ))}
                                        </select>
                                        {challenge.category?.id ?
                                            <div>
                                                <div className="round-icon yellow pointer"
                                                    onClick={() => {
                                                        setShowCategoryModal(true)
                                                        setEditCategory({ ...challenge.category })
                                                    }}>
                                                    <FontAwesomeIcon icon={fa.faPen} />
                                                </div>
                                            </div>
                                            : null}
                                    </div>
                                    <span className='input-link' onClick={() => setShowCategoryModal(true)}>
                                        New category
                                    </span>
                                </div>
                            </div>
                            <div className="row">
                                <div className='input-group-50'>
                                    <label>Brief</label>
                                    <input type="text" className='input-field' required
                                        onChange={(e) => {
                                            setChallenge({ ...challenge, brief: e.target.value })
                                        }} value={challenge?.brief || ""}
                                    />
                                    <span className='input-description'>
                                        A small description to be displayed on hover
                                    </span>
                                </div>
                            </div>
                            <div className="row gap-35">
                                <div className='input-group'>
                                    <label>Description</label>
                                    <textarea type="text" className='input-field textarea' required
                                        onChange={(e) => {
                                            setChallenge({ ...challenge, description: e.target.value })
                                        }} value={challenge?.description || ""}
                                    />
                                </div>
                            </div>
                            <div className='col gap-15'>
                                <div className='input-group'>
                                    <label>Icon</label>
                                    <div className='row vertical-center gap-15 search-field'>
                                        <input type="text" className='search-input'
                                            placeholder='Search icon...'
                                            onChange={(e) => {
                                                setIconSearch(e.target.value)
                                            }} value={iconSearch}
                                        />
                                        <FontAwesomeIcon className="text-light text-huge to-right" icon={fa.faMagnifyingGlass} />
                                    </div>
                                </div>
                                <div className="row gap-15 wrap maxh-200 minh-20 overflowy-scroll p-15 filled-container rounded-15">
                                    {searchMatch(iconSearch, Object.keys(fa).filter(i => i !== 'fas' && i !== 'prefix')).map((key, index) => (
                                        <button type="button" key={index} className={`${challenge.icon === key ? ' blue text-white ' : ' white text-dark border-light '} flex pointer p-5 square-small centered vertical-center text-small`}
                                            onClick={() => {
                                                setChallenge({ ...challenge, icon: key })
                                            }}>
                                            <FontAwesomeIcon icon={fa[key]} size="2x" />
                                        </button>
                                    ))}
                                </div>
                                <div className="row">
                                    <div className='row gap-10 text-dark vertical-center'>
                                        <b>Selected Icon:</b>
                                        {challenge.icon ?
                                            <>
                                                <FontAwesomeIcon icon={fa[challenge.icon]} />
                                                <b>{challenge.icon}</b>
                                            </>
                                            : <span>None</span>}
                                    </div>
                                    <div className="row to-right gap-15">
                                        <b>Showing</b>
                                        <input type="number" className='text-blue naked w-75px text-center text-big'
                                            onChange={(e) => {
                                                if (parseInt(e.target.value) > Object.keys(fa).length)
                                                    setIconMaxValues(Object.keys(fa).length)
                                                else
                                                    setIconMaxValues(e.target.value)
                                            }}
                                            value={iconMaxValues} />
                                        <b>Results</b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span className="section-title">
                            Quizz questions
                        </span>
                        <div className="radius-15 filled-container p-30">
                            <div className="input-section">
                                <div className='row space-between'>
                                    <div className="round-card w-30">
                                        <span className="card-title">
                                            {questionLevel["EASY"]}
                                        </span>
                                        <span className='card-value green to-right'>{challenge.questions?.filter(q => q.level === "EASY")?.length || 0}</span>
                                    </div>
                                    <div className="round-card w-30">
                                        <span className="card-title">
                                            {questionLevel["MEDIUM"]}
                                        </span>
                                        <span className='card-value orange to-right'>{challenge.questions?.filter(q => q.level === "MEDIUM")?.length || 0}</span>
                                    </div>
                                    <div className="round-card w-30">
                                        <span className="card-title">
                                            {questionLevel["HARD"]}
                                        </span>
                                        <span className='card-value red to-right'>{challenge.questions?.filter(q => q.level === "HARD")?.length || 0}</span>
                                    </div>
                                </div>
                                <div className="row centered gap-25">
                                    <button type="button" className="button-flat white text-dark border-thin"
                                        onClick={() => {
                                            setShowQuestionsModal(true)
                                        }}>
                                        Manage List
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {challenge.checkpoints?.map((checkpoint, index) => (
                        <div key={index}>
                            <span className="section-title row w-100 vertical-bottom">
                                Checkpoint {index + 1}
                                <button type="button" className="round-icon white pointer to-right text-center"
                                    onClick={() => {
                                        let checkpoints = [...challenge.checkpoints]
                                        checkpoints.splice(index, 1)
                                        setChallenge({ ...challenge, checkpoints: checkpoints })
                                    }}>
                                    <FontAwesomeIcon icon={fa.faTrashAlt} className="text-red text-bigger" />
                                </button>
                            </span>
                            <div className="radius-15 outlined-container p-30">
                                <div className="input-section">
                                    <div className="row gap-35">
                                        <div className='input-group'>
                                            <label>Description</label>
                                            <textarea type="text" className='input-field textarea' required
                                                onChange={(e) => {
                                                    let checkpointList = [...challenge.checkpoints]
                                                    checkpointList[index].description = e.target.value
                                                    setChallenge({ ...challenge, checkpoints: checkpointList })
                                                }} value={checkpoint?.description || ""} />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="group-title">References</span>
                                        <div className="box-section">
                                            {checkpoint.references?.map((reference, rIndex) => (
                                                <div className="radius-15 filled-container row">
                                                    <div className="row p-20 w-100">
                                                        <div className='input-group-50'>
                                                            <label>Title</label>
                                                            <input type="text" className='input-field' required
                                                                onChange={(e) => {
                                                                    let editReference = checkpoint.references[rIndex]
                                                                    editReference.title = e.target.value
                                                                    let checkpointList = [...challenge.checkpoints]
                                                                    checkpointList[index].references[rIndex] = editReference
                                                                    setChallenge({ ...challenge, checkpoints: checkpointList })
                                                                }} value={reference?.title || ""} />
                                                        </div>
                                                        <div className='input-group-50'>
                                                            <label>Link</label>
                                                            <input type="text" className='input-field' required
                                                                onChange={(e) => {
                                                                    let editReference = checkpoint.references[rIndex]
                                                                    editReference.link = e.target.value
                                                                    let checkpointList = [...challenge.checkpoints]
                                                                    checkpointList[index].references[rIndex] = editReference
                                                                    setChallenge({ ...challenge, checkpoints: checkpointList })
                                                                }} value={reference?.link || ""} />
                                                        </div>
                                                    </div>
                                                    <div className='p-10 red flex vertical-center text-white text-bigger pointer'
                                                        onClick={() => {
                                                            let checkpointList = [...challenge.checkpoints]
                                                            let referenceList = [...checkpoint.references]
                                                            referenceList.splice(rIndex, 1)
                                                            checkpointList[index].references = referenceList
                                                            setChallenge({ ...challenge, checkpoints: checkpointList })
                                                        }}>
                                                        <FontAwesomeIcon icon={fa.faTrashAlt} />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="row centered">
                                                <button type="button" className="button-flat blue text-white"
                                                    onClick={() => {
                                                        let checkpointList = [...challenge.checkpoints]
                                                        checkpointList[index].references = [...(checkpoint.references || []), { title: null, link: null }]
                                                        setChallenge({ ...challenge, checkpoints: checkpointList })
                                                    }}>
                                                    Add reference
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="group-title">Technologies</span>
                                        <div className="chip-section">
                                            {challenge.checkpoints && challenge.checkpoints[index]?.technologies?.map((technology, tIndex) => (
                                                <div className="chip white text-dark border-thin" key={tIndex}>
                                                    <button type="button" className="chip-button">
                                                        <FontAwesomeIcon icon={fa.faCircleXmark} className="pointer"
                                                            onClick={() => {
                                                                let technologiesList = [...challenge.checkpoints[index].technologies]
                                                                technologiesList.splice(tIndex, 1)
                                                                let checkpointList = [...challenge.checkpoints]
                                                                checkpointList[index].technologies = technologiesList
                                                                setChallenge({ ...challenge, checkpoints: checkpointList })
                                                            }} />
                                                    </button>
                                                    <span>{technology}</span>
                                                </div>
                                            ))}
                                            <button type="button" className="add-button"
                                                onClick={() => {
                                                    let checkpointList = [...challenge.checkpoints]
                                                    checkpointList[index].technologies = [...(checkpoint.technologies || []), "Test"]
                                                    setChallenge({ ...challenge, checkpoints: checkpointList })
                                                }}>
                                                <FontAwesomeIcon icon={fa.faPlus} />
                                                <span>Add technology</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="row centered">
                        <button type="button" className="button-flat blue text-white"
                            onClick={() => {
                                setChallenge({ ...challenge, checkpoints: [...challenge.checkpoints, {}] })
                            }}>
                            Add Checkpoint
                        </button>
                    </div>
                    <div className="row justify-right gap-25">
                        <NavLink to="/challenges" className='button-rounded gray text-white'>
                            Cancel
                        </NavLink>
                        <button type="submit" className="button-rounded green text-white ">
                            Save
                        </button>
                    </div>
                </form>
                <Modal show={showCategoryModal} close={() => closeCategoryModal()} >
                    <form className='col gap-25'
                        onSubmit={(e) => {
                            e.preventDefault()
                            e.stopPropagation()

                            let categoryData = { ...editCategory }

                            let type = "post"

                            if (categoryData.id)
                                type = "put"

                            setLoadingCategoryChanges(true)
                            axios[type](`${consts.LOCAL_API}/challenges/category`, categoryData)
                                .then((res) => {
                                })
                                .catch(() => {
                                })
                                .then(() => {
                                    setLoadingCategoryChanges(false)
                                    closeCategoryModal()
                                })
                        }}>
                        <div className="row w-100">
                            <b className="text-huge">
                                New Category
                            </b>
                            <div className="round-icon white text-light to-right text-bigger pointer"
                                onClick={() => closeCategoryModal()}
                            >
                                <FontAwesomeIcon icon={fa.faTimes} />
                            </div>
                        </div>
                        <div className="row w-100 vertical-bottom">
                            <div className='input-group-50'>
                                <label>Title</label>
                                <input type="text" className='input-field' required disabled={loadingCategoryChanges}
                                    onChange={(e) => {
                                        setEditCategory({ ...editCategory, title: e.target.value })
                                    }} value={editCategory?.title || ""}
                                />
                            </div>
                            <b className="text-bigger w-50 text-center p-5" style={{ color: editCategory.accentColor }}>
                                {editCategory?.title || "Text Preview"}
                            </b>
                        </div>
                        <div className='input-group-50 flex gap-10'>
                            <div>
                                <label>Accent Color</label>
                            </div>
                            <div className='row gap-10 wrap'>
                                {accentColors.map((accentColor) => (
                                    <div type="checkbox" className="color-box" style={{ backgroundColor: accentColor }}
                                        onClick={() => {
                                            if (!loadingCategoryChanges)
                                                setEditCategory({ ...editCategory, accentColor: accentColor })
                                        }}>
                                        {editCategory.accentColor === accentColor ?
                                            <FontAwesomeIcon icon={fa.faCheck} /> : null}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="row justify-right vertical-center gap-25">
                            {loadingCategoryChanges ?
                                <Spinner size="sm" color='dark' /> : null}
                            <button className="button-rounded green text-white" type='submit' disabled={loadingCategoryChanges}>
                                Save
                            </button>
                        </div>
                    </form>
                </Modal>

                <Modal show={showQuestionsModal} close={() => closeQuestionsModal()} >
                    <form className='col gap-25' onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()

                        let questionData = { ...editQuestion }

                        setChallenge({ ...challenge, questions: [...(challenge.questions || []), questionData] })
                        setEditQuestion({ ...initialQuestion })
                    }}>
                        <div className="row w-100">
                            <b className="text-huge">
                                Add Question
                            </b>
                            <div className="round-icon white text-light to-right text-bigger pointer"
                                onClick={() => closeQuestionsModal()}
                            >
                                <FontAwesomeIcon icon={fa.faTimes} />
                            </div>
                        </div>
                        <div className="row">
                            <div className='input-group-50'>
                                <label>Title</label>
                                <input type="text" className='input-field' required
                                    onChange={(e) => {
                                        setEditQuestion({ ...editQuestion, title: e.target.value })
                                    }} value={editQuestion?.title || ""}
                                />
                            </div>
                            <div className='input-group-50'>
                                <label>Level</label>
                                <select className='input-field' required
                                    onChange={(e) => {
                                        setEditQuestion({ ...editQuestion, level: e.target.value })
                                    }} value={editQuestion.level || ""}
                                >
                                    <option value="">Select...</option>
                                    <option value="EASY">{questionLevel["EASY"]}</option>
                                    <option value="MEDIUM">{questionLevel["MEDIUM"]}</option>
                                    <option value="HARD">{questionLevel["HARD"]}</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className='input-group-50'>
                                <label>Type</label>
                                <select className='input-field' required
                                    onChange={(e) => {
                                        setEditQuestion({ ...editQuestion, type: e.target.value })
                                    }} value={editQuestion.type || ""}
                                >
                                    <option value="">Select...</option>
                                    <option value="PRACTICAL">{questionType["PRACTICAL"]}</option>
                                    <option value="THEORICAL">{questionType["THEORICAL"]}</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className='input-group-50'>
                                <label>New Option</label>
                                <div className="row w-100 gap-15 vertical-center">
                                    <input type="text" className='input-field' required
                                        onChange={(e) => {
                                            setNewQuestionOption(e.target.value)
                                        }} value={newQuestionOption || ""}
                                    />
                                    <div>
                                        <div className="round-icon green text-white pointer text-bigger"
                                            onClick={() => {
                                                setEditQuestion({ ...editQuestion, options: [...(editQuestion.options || []), { value: (newQuestionOption || ""), correctAnswer: false }] })
                                                setNewQuestionOption("")
                                            }}>
                                            <FontAwesomeIcon icon={fa.faPlus} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-100 col p-10 gap-10">
                            <span className='text-big text-thick'>Answer Options</span>
                            {editQuestion.options?.length > 0 ?
                                <div className='row gap-10 wrap p-5'>
                                    {editQuestion.options?.map((option, index) => (
                                        <div className="col">
                                            <div className="button-flat dark text-white">
                                                {option.value}
                                            </div>
                                            <div className='row'>
                                                <input type="checkbox" name={`check-${index}`} id={`check-${index}`} />
                                                <label className="check-label" for={`check-${index}`}>Correct answer</label>
                                                <FontAwesomeIcon icon={fa.faTrashAlt} className="to-right text-red p-5 pointer"
                                                    onClick={() => {
                                                        let optionList = [...editQuestion.options]
                                                        optionList.splice(index, 1)
                                                        setEditQuestion({ ...editQuestion, options: optionList })
                                                    }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                :
                                <div className="row centered w-100">
                                    <span className="text-gray text-big">No Options</span>
                                </div>}
                        </div>
                        <div className="row justify-right vertical-center gap-25">
                            <button className="button-rounded green text-white" type='submit'>
                                Add
                            </button>
                        </div>
                        <div className="col w-100">
                            <b className="text-huge">
                                Question List
                            </b>
                            <div className="p-15 w-100">
                                {challenge.questions?.length > 0 ?
                                    <>
                                        <table className='text-big w-100'>
                                            <tr>
                                                <th className='text-center'>
                                                    <b>Title</b>
                                                </th>
                                                <th className='text-center'>
                                                    <b>Level</b>
                                                </th>
                                                <th className='text-center'>
                                                    <b>Type</b>
                                                </th>
                                                <th className='text-center'>
                                                    <b>Options</b>
                                                </th>
                                                <th></th>
                                            </tr>
                                            {challenge.questions.map((question, index) => (
                                                <tr className={`${index % 2 === 0 ? 'bg-lighter' : ''}`}>
                                                    <td className='w-100 p-10'>
                                                        {question.title}
                                                    </td>
                                                    <td className='p-10 text-center'>
                                                        {questionType[question.type]}
                                                    </td>
                                                    <td className='p-10 text-center'>
                                                        {questionLevel[question.level]}
                                                    </td>
                                                    <td className='p-10 text-center'>
                                                        {question.options.length}
                                                    </td>
                                                    <td className='p-10 row'>
                                                        <button className="round-icon text-bigger pointer" type="button"
                                                            onClick={() => {
                                                                let questions = [...(challenge.questions || [])]
                                                                questions.splice(index, 1)
                                                                setChallenge({ ...challenge, questions: questions })
                                                            }}>
                                                            <FontAwesomeIcon icon={fa.faTrashAlt} className="text-red" />
                                                        </button>
                                                        <button className="round-icon text-bigger pointer" type="button"
                                                            onClick={() => {

                                                            }}>
                                                            <FontAwesomeIcon icon={fa.faPen} className="text-dark" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </table>
                                    </>
                                    :
                                    <div className="row centered w-100">
                                        <span className="text-gray text-bigger">No questions</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default ChallengeForm;