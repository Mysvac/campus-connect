package com.mythovac.backend.service.impl;

import com.mythovac.backend.entity.ScoresRelease;
import com.mythovac.backend.mapper.ScoresReleaseMapper;
import com.mythovac.backend.service.ScoresReleaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoresReleaseServiceImpl implements ScoresReleaseService {
    @Autowired
    private ScoresReleaseMapper scoresReleaseMapper;

    @Override
    public List<ScoresRelease> getAllScoresRelease(){
        return scoresReleaseMapper.getAllScoresRelease();
    }
    @Override
    public List<ScoresRelease> getScoresReleaseByUid(Long uid){
        return scoresReleaseMapper.getScoresReleaseByUid(uid);
    }
    @Override
    public ScoresRelease getScoresReleaseBySid(Long sid){
        return scoresReleaseMapper.getScoresReleaseBySid(sid);
    }
    @Override
    public void insertScoresRelease(ScoresRelease scoresRelease){
        scoresReleaseMapper.insertScoresRelease(scoresRelease);
    }
    @Override
    public void deleteScoresReleaseBySid(Long sid){
        scoresReleaseMapper.deleteScoresReleaseBySid(sid);
    }

}
