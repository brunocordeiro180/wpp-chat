import React from 'react'

const DataCard = ({title, icon, qtd}) => {

    const Icon = icon;

    return (
        <div className="col-sm-6 col-md-6 col-lg-3">
            <div className="card-stats card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-5 col-md-4">
                            <div className="icon-big text-center icon-warning">
                                <Icon size={30} /> 
                            </div>
                        </div>
                        <div className="col-7 col-md-8">
                            <div className="numbers">
                                <p className="card-category">{title}</p>
                                <p className="card-title">{qtd}</p>
                                <p></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DataCard;