package com.albertsons.meitem.service.itemv2;

import com.albertsons.meitem.constants.GlobalConstants;
import com.albertsons.meitem.model.mongo.maintenance.Attribute;
import com.albertsons.meitem.model.mongo.maintenance.Tab;
import com.albertsons.meitem.model.mongo.maintenance.TabsCollection;
import com.albertsons.meitem.repository.mongo.MaintainMetadataRepository;
import com.albertsons.meitem.response.maintenace.AttributeDTO;
import com.albertsons.meitem.response.maintenace.ResponsePayloadDTO;
import com.albertsons.meitem.response.maintenace.TabDTO;
import com.albertsons.meitem.utils.RequestContextManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class MaintenanceMetaServiceImpl implements MaintenanceMetaService {

    @Autowired
    MaintainMetadataRepository maintainMetadataRepository;


    @Override
    public ResponsePayloadDTO getMaintenanceMeta() {
        String authRole = String.valueOf(RequestContextManager.getValue(GlobalConstants.AUTHROLE)).toUpperCase();
        List<TabsCollection> allMetadata = maintainMetadataRepository.findByTabsAttributesIsEditableBy(authRole);
        allMetadata.stream().map(document -> filterAttributesByEditableBy(document, authRole)).collect(Collectors.toList());
        ResponsePayloadDTO responsePayloadDTO = new ResponsePayloadDTO();
        List<TabDTO> tabDTOs = new ArrayList<>();
        List<AttributeDTO> attributeDTOs = new ArrayList<>();
        for (TabsCollection employee : allMetadata) {
            for (Tab tab : employee.getTabs()) {
                for (Attribute attribute : tab.getAttributes()) {
                    AttributeDTO attributeDTO = new AttributeDTO();
                    attributeDTO.setName(attribute.getName());
                    attributeDTO.setMaintenanceType(attribute.getMaintenanceType());
                    if (attribute.getCicImpacted() != null) {
                        attributeDTO.setCicImpacted(attribute.getCicImpacted());
                    }
                    attributeDTOs.add(attributeDTO);
                }
                TabDTO tabDTO = new TabDTO();
                tabDTO.setName(tab.getName());
                tabDTO.setAttributes(attributeDTOs);
                tabDTOs.add(tabDTO);
            }
            responsePayloadDTO.setTabs(tabDTOs);
        }
        return responsePayloadDTO;
    }

    private TabsCollection filterAttributesByEditableBy(TabsCollection document, String editableBy) {
        List<Tab> filteredTabs = document.getTabs().stream().map(tab -> {
            List<Attribute> filteredAttributes = tab.getAttributes().stream().filter(attr -> attr.getIsEditableBy().contains(editableBy)).collect(Collectors.toList());
            tab.setAttributes(filteredAttributes);
            return tab;
        }).filter(tab -> !tab.getAttributes().isEmpty()).collect(Collectors.toList());
        document.setTabs(filteredTabs);
        List<AttributeDTO> attributes = new ArrayList<>();
        return document;
    }
}
